// Secondary lead delivery channel — mirrors every form submission to
// a webhook (Discord / Slack / Zapier / n8n / anything that accepts a
// POST) alongside the primary Resend email.
//
// Why: Resend has failed us multiple times (revoked API key, invalid
// replyTo rejection, deliverability to spam). The webhook is a totally
// independent channel — different provider, different auth, different
// failure modes — so both dying at the same time is vanishingly rare.
//
// The webhook always fires, not just as a fallback: two guaranteed
// notifications per lead > one flaky notification. Even if Resend is
// perfect on a given day, the Discord ping arrives on your phone in
// ~500 ms, which is often better UX than email polling anyway.
//
// Configure by setting LEAD_WEBHOOK_URL in Vercel env vars:
//   - Discord: https://discord.com/api/webhooks/... (create in
//     server settings → Integrations → Webhooks)
//   - Slack:   https://hooks.slack.com/services/... (Slack apps →
//     Incoming webhooks)
//   - Zapier / n8n / Make: any 'Catch Hook' URL — payload arrives as
//     raw JSON.
//
// Missing env var → helper is a silent no-op. No user-facing failure
// if the webhook isn't set up yet.

export type LeadSource = "start" | "flashka" | "contact" | "brief";

export type LeadMirrorPayload = {
  source: LeadSource;
  brand: string;
  name: string;
  email: string;
  phone: string;
  // Extra fields shown as key/value chips. Content-type + budget for
  // /start; company + message for /contact; timeline + engagement +
  // budget for /brief; etc.
  extra?: Record<string, string | undefined>;
  // Delivery status of the primary Resend send, so a single glance at
  // the webhook notification tells us whether we also need to worry
  // about the email leg.
  resendStatus: "ok" | "failed" | "skipped";
  resendId?: string;
  resendError?: string;
};

/** Truncate a value to a safe display length. */
function trim(s: string | undefined, max = 300): string {
  if (!s) return "";
  const flat = String(s).trim();
  return flat.length > max ? flat.slice(0, max) + "…" : flat;
}

function buildDiscordBody(p: LeadMirrorPayload): unknown {
  const ok = p.resendStatus === "ok";
  const statusEmoji = ok ? "✅" : "⚠️";
  const color = ok ? 0xf4f4f4 : 0xff8b00; // lime for OK, amber for degraded

  const fields = [
    { name: "📧 Email", value: p.email || "(none)", inline: true },
    { name: "📞 Phone", value: p.phone || "(none)", inline: true },
    { name: "🏢 Business", value: trim(p.brand, 100) || "(none)", inline: false },
  ];

  // Extra fields (content-type, budget, timeline, message, etc.)
  Object.entries(p.extra || {}).forEach(([k, v]) => {
    if (!v || !String(v).trim()) return;
    fields.push({
      name: k,
      value: trim(v, 500),
      inline: String(v).length < 40,
    });
  });

  if (!ok) {
    fields.push({
      name: "⚠ Resend status",
      value: `${p.resendStatus.toUpperCase()}${p.resendError ? ` — ${trim(p.resendError, 300)}` : ""}`,
      inline: false,
    });
  }

  return {
    content: `${statusEmoji} **[${p.source.toUpperCase()}]** ${trim(p.brand, 80) || "(no brand)"} — ${trim(p.name, 60) || "(no name)"}`,
    embeds: [
      {
        title: trim(p.brand, 80) || "(no brand)",
        description: [p.name, p.email, p.phone].filter(Boolean).join(" · "),
        color,
        fields,
        footer: { text: `vektoagency.com/${p.source} · Resend ${p.resendStatus}` },
        timestamp: new Date().toISOString(),
      },
    ],
  };
}

function buildSlackBody(p: LeadMirrorPayload): unknown {
  const ok = p.resendStatus === "ok";
  const statusEmoji = ok ? ":white_check_mark:" : ":warning:";
  const header = `${statusEmoji} *[${p.source.toUpperCase()}]* ${trim(p.brand, 80) || "(no brand)"} — ${trim(p.name, 60) || "(no name)"}`;
  const lines = [
    header,
    `Email: ${p.email || "(none)"}`,
    `Phone: ${p.phone || "(none)"}`,
    `Business: ${trim(p.brand, 100) || "(none)"}`,
  ];
  Object.entries(p.extra || {}).forEach(([k, v]) => {
    if (v && String(v).trim()) lines.push(`${k}: ${trim(v, 500)}`);
  });
  if (!ok) {
    lines.push(`Resend: ${p.resendStatus}${p.resendError ? ` — ${trim(p.resendError, 300)}` : ""}`);
  }
  return { text: lines.join("\n") };
}

/**
 * Post a lead to the configured LEAD_WEBHOOK_URL. Never throws — a
 * failure here should not break the primary form-submit response to
 * the client. All failures land in Vercel Runtime Logs so we can
 * still diagnose after the fact.
 */
export async function mirrorLeadToWebhook(payload: LeadMirrorPayload): Promise<void> {
  const url = process.env.LEAD_WEBHOOK_URL;
  if (!url) {
    return; // silent no-op when unconfigured
  }

  const isSlack = url.includes("hooks.slack.com");
  const isDiscord =
    url.includes("discord.com/api/webhooks") ||
    url.includes("discordapp.com/api/webhooks");

  const body = isDiscord
    ? buildDiscordBody(payload)
    : isSlack
      ? buildSlackBody(payload)
      : payload; // generic JSON for Zapier / n8n / custom endpoints

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      // 10-second cap — a slow webhook shouldn't block the response
      // to the client indefinitely.
      signal: AbortSignal.timeout(10_000),
    });
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      console.error("[lead-mirror] webhook non-2xx", {
        status: res.status,
        body: text.slice(0, 500),
        source: payload.source,
      });
      return;
    }
    console.log("[lead-mirror] posted", { source: payload.source, resendStatus: payload.resendStatus });
  } catch (err) {
    console.error("[lead-mirror] fetch threw", { err, source: payload.source });
  }
}

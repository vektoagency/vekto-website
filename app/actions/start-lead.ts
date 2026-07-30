"use server";

import { Resend } from "resend";
import { headers, cookies } from "next/headers";
import { fireMetaCapiEvent } from "../lib/meta-capi";
import { mirrorLeadToWebhook } from "../lib/lead-mirror";

const resend = new Resend(process.env.RESEND_API_KEY);

export type StartLead = {
  lang: "bg" | "en";
  // Which LP the form was submitted from. Lets us segment leads in the
  // inbox + dedup CAPI events per source. Defaults to "start" for
  // back-compat with the original /start form.
  source?: "start" | "flashka";
  name: string;
  email: string;
  brand: string;
  phone: string;
  contentType: string;
  contentTypeLabel: string;
  budget: string;       // numeric string (e.g., "2500")
  budgetLabel: string;
  message: string;
  // Generated client-side (crypto.randomUUID) and reused by both the
  // browser pixel AND the server-side CAPI fire below — Meta dedups on
  // event_id within a ~5 min window, counting each Lead exactly once.
  eventId: string;
  // UTM params from ad clicks — let us see which campaign/creative drives leads.
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmContent?: string;
  utmTerm?: string;
  referrer?: string;
};

function escape(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function row(label: string, value: string): string {
  if (!value || !value.trim()) return "";
  return `
    <tr>
      <td style="padding:8px 12px;border-bottom:1px solid #1e1e1c;color:#9a958e;font-size:11px;text-transform:uppercase;letter-spacing:0.18em;font-family:monospace;width:160px;vertical-align:top">${label}</td>
      <td style="padding:8px 12px;border-bottom:1px solid #1e1e1c;color:#ece8e1;font-size:14px;line-height:1.55;vertical-align:top">${escape(value)}</td>
    </tr>
  `;
}

export async function submitStartLead(data: StartLead) {
  if (!data.email) return { success: false, error: "Missing email" };

  const brandLabel = data.brand?.trim() || "(no brand)";
  const nameLabel = data.name?.trim() || "(no name)";

  const rows =
    row("Name", data.name) +
    row("Email", data.email) +
    row("Brand / site", data.brand) +
    row("Phone", data.phone) +
    row("Content type", data.contentTypeLabel) +
    row("Monthly budget", data.budgetLabel) +
    row("Message", data.message) +
    // Ad attribution — only render rows that have values
    row("Source", data.utmSource || "") +
    row("Medium", data.utmMedium || "") +
    row("Campaign", data.utmCampaign || "") +
    row("Ad / Content", data.utmContent || "") +
    row("Term", data.utmTerm || "") +
    row("Referrer", data.referrer || "");

  const source = data.source ?? "start";
  const sourcePath = source === "flashka" ? "/flashka" : "/start";
  const sourceTitle = source === "flashka" ? "FLASHKA APPLICATION" : "NEW LEAD (/start)";

  const html = `
    <div style="background:#080808;color:#ece8e1;font-family:Arial,sans-serif;padding:32px">
      <div style="max-width:640px;margin:0 auto;background:#0d0d0d;border:1px solid #1e1e1c;border-radius:6px;overflow:hidden">
        <div style="padding:24px 28px;border-bottom:2px solid #c8ff00;background:#0a0a0a">
          <div style="font-family:monospace;font-size:11px;letter-spacing:0.3em;color:#c8ff00;text-transform:uppercase;margin-bottom:8px">VEKTO / ${sourceTitle}</div>
          <h1 style="margin:0;font-size:20px;color:#fff">${escape(brandLabel)}</h1>
          <div style="margin-top:6px;color:#9a958e;font-size:13px">${escape(nameLabel)} · ${escape(data.email)}${data.phone ? ` · ${escape(data.phone)}` : ""}</div>
        </div>
        <table style="width:100%;border-collapse:collapse">${rows}</table>
        <div style="padding:14px 28px;background:#0a0a0a;color:#666;font-size:11px;font-family:monospace;letter-spacing:0.18em;text-transform:uppercase">
          Submitted ${data.lang.toUpperCase()} · vektoagency.com${sourcePath}
        </div>
      </div>
    </div>
  `;

  const sourceTag = source === "flashka" ? " [FLASHKA]" : data.utmSource ? ` [${data.utmSource.toUpperCase()}]` : "";
  const subjectLabel = source === "flashka" ? "APPLY" : "LEAD";
  // Only pass replyTo if the value looks like an actual email. Resend
  // rejects the whole send with 422 'invalid reply_to' when the value
  // is garbage (bots, typos, honeypot fills).
  const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email?.trim() || "");

  // Track the Resend attempt so we can mirror the outcome (ok/failed/
  // skipped) to the webhook. The mirror always fires — Resend success
  // doesn't skip it — so the owner has two independent notification
  // channels for every lead. See app/lib/lead-mirror.ts for rationale.
  let resendStatus: "ok" | "failed" | "skipped" = "skipped";
  let resendId: string | undefined;
  let resendError: string | undefined;

  try {
    const result = await resend.emails.send({
      from: "VEKTO Lead <no-reply@vektoagency.com>",
      to: process.env.CONTACT_EMAIL!,
      subject: `[${subjectLabel}]${sourceTag} ${brandLabel} — ${data.contentTypeLabel || "?"} · ${data.budgetLabel || "?"}`,
      html,
      ...(validEmail ? { replyTo: data.email } : {}),
    });
    if (result.error) {
      console.error("[start-lead] Resend send returned error", {
        error: result.error,
        to: process.env.CONTACT_EMAIL,
        from: "no-reply@vektoagency.com",
        subject: `[${subjectLabel}] ${brandLabel}`,
      });
      resendStatus = "failed";
      resendError = result.error.message || String(result.error);
    } else {
      resendStatus = "ok";
      resendId = result.data?.id;
      console.log("[start-lead] Resend send OK", { id: resendId, to: process.env.CONTACT_EMAIL });
    }
  } catch (err) {
    console.error("[start-lead] Resend send threw", err);
    resendStatus = "failed";
    resendError = err instanceof Error ? err.message : String(err);
  }

  // Fire-and-forget mirror to the webhook. Never awaited on the same
  // path that returns to the client, so a slow Discord/Slack doesn't
  // block the form success response. But we DO await it inside a
  // catch-safe block so Vercel logs still capture the outcome.
  await mirrorLeadToWebhook({
    source: source === "flashka" ? "flashka" : "start",
    brand: data.brand || "",
    name: data.name || "",
    email: data.email || "",
    phone: data.phone || "",
    extra: {
      "Content type": data.contentTypeLabel || data.contentType,
      "Monthly budget": data.budgetLabel || data.budget,
      Message: data.message,
      UTM: [data.utmSource, data.utmMedium, data.utmCampaign].filter(Boolean).join(" · ") || undefined,
      Referrer: data.referrer,
    },
    resendStatus,
    resendId,
    resendError,
  });

  // The lead is captured either way (webhook mirror), so we tell the
  // client success as long as ONE of the two channels landed. Only
  // both-failed is a real failure the user needs to see + retry.
  if (resendStatus === "failed" && !process.env.LEAD_WEBHOOK_URL) {
    return { success: false, error: "Failed to send" };
  }

  // After the email is safely sent, mirror the Lead event to Meta's
  // Conversions API server-side. Pixel already fires on the client, but
  // ~30-50% of iOS / AdBlock / cookie-rejected users miss that. CAPI
  // bypasses all those — dedup by event_id ensures Meta counts each
  // conversion exactly once. Failure of this fire never breaks the
  // user-facing success response (meta-capi.ts swallows errors).
  try {
    const h = await headers();
    const c = await cookies();
    const budgetValue = parseFloat(data.budget) || undefined;
    const [firstName, ...lastParts] = data.name.trim().split(/\s+/);
    const lastName = lastParts.join(" ");
    await fireMetaCapiEvent({
      eventName: "Lead",
      eventId: data.eventId,
      eventSourceUrl: `https://vektoagency.com${sourcePath}${data.utmSource ? `?utm_source=${data.utmSource}` : ""}`,
      userData: {
        email: data.email,
        phone: data.phone,
        firstName: firstName || undefined,
        lastName: lastName || undefined,
        country: data.lang === "bg" ? "bg" : undefined,
        fbp: c.get("_fbp")?.value,
        fbc: c.get("_fbc")?.value,
        clientIp:
          h.get("x-forwarded-for")?.split(",")[0]?.trim() ||
          h.get("x-real-ip") ||
          undefined,
        clientUserAgent: h.get("user-agent") || undefined,
      },
      customData: {
        value: budgetValue,
        currency: "EUR",
        contentName: data.contentTypeLabel || data.contentType || undefined,
        contentCategory: "Lead",
      },
    });
  } catch (err) {
    // Don't break the form success — pixel already fired client-side.
    console.error("[start-lead] CAPI mirror failed", err);
  }

  return { success: true };
}

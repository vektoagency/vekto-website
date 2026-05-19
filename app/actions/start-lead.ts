"use server";

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export type StartLead = {
  lang: "bg" | "en";
  name: string;
  email: string;
  brand: string;
  phone: string;
  contentType: string;
  contentTypeLabel: string;
  budget: string;
  budgetLabel: string;
  message: string;
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

  const html = `
    <div style="background:#080808;color:#ece8e1;font-family:Arial,sans-serif;padding:32px">
      <div style="max-width:640px;margin:0 auto;background:#0d0d0d;border:1px solid #1e1e1c;border-radius:6px;overflow:hidden">
        <div style="padding:24px 28px;border-bottom:2px solid #c8ff00;background:#0a0a0a">
          <div style="font-family:monospace;font-size:11px;letter-spacing:0.3em;color:#c8ff00;text-transform:uppercase;margin-bottom:8px">VEKTO / NEW LEAD (/start)</div>
          <h1 style="margin:0;font-size:20px;color:#fff">${escape(brandLabel)}</h1>
          <div style="margin-top:6px;color:#9a958e;font-size:13px">${escape(nameLabel)} · ${escape(data.email)}${data.phone ? ` · ${escape(data.phone)}` : ""}</div>
        </div>
        <table style="width:100%;border-collapse:collapse">${rows}</table>
        <div style="padding:14px 28px;background:#0a0a0a;color:#666;font-size:11px;font-family:monospace;letter-spacing:0.18em;text-transform:uppercase">
          Submitted ${data.lang.toUpperCase()} · vektoagency.com/start
        </div>
      </div>
    </div>
  `;

  try {
    // Tag subject with source if it's a paid lead — easy filter in inbox
    const sourceTag = data.utmSource ? ` [${data.utmSource.toUpperCase()}]` : "";
    await resend.emails.send({
      from: "VEKTO Lead <onboarding@resend.dev>",
      to: process.env.CONTACT_EMAIL!,
      subject: `[LEAD]${sourceTag} ${brandLabel} — ${data.contentTypeLabel || "?"} · ${data.budgetLabel || "?"}`,
      html,
      replyTo: data.email,
    });
    return { success: true };
  } catch {
    return { success: false, error: "Failed to send" };
  }
}

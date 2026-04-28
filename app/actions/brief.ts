"use server";

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

// Shape mirrors the form fields in BriefClient.tsx. Kept as Record<string,
// string | string[]> so we don't have to enumerate every key — the email
// renderer just iterates and shows whatever was filled in.
export type BriefSubmission = {
  lang: "bg" | "en";
  // step 1
  brand: string;
  website: string;
  ig: string;
  industry: string;
  stage: string;
  revenue: string;
  teamSize: string;
  // step 2
  pitch: string;
  audience: string;
  problem: string;
  usp: string;
  competitors: string;
  tone: string;
  // step 3
  platforms: string[];
  postsPerMonth: string;
  currentMaker: string;
  avgPerformance: string;
  whatNotWorking: string;
  topClips: string;
  adSpend: string;
  // step 4
  services: string[];
  volume: string;
  multilingual: string;
  includeStrategy: string;
  // step 5
  mainGoal: string;
  goal90Days: string;
  successMetric: string;
  tracking: string;
  // step 6
  brandAssets: string;
  refsLove: string;
  refsHate: string;
  music: string;
  restrictions: string;
  hasScripts: string;
  // step 7
  timeline: string;
  engagement: string;
  budget: string;
  name: string;
  role: string;
  email: string;
  phone: string;
  preferredChannel: string;
  additional: string;
};

const FIELD_LABELS: Record<string, string> = {
  brand: "Company",
  website: "Website",
  ig: "Instagram",
  industry: "Industry",
  stage: "Stage",
  revenue: "Monthly revenue",
  teamSize: "Team size",
  pitch: "One-line pitch",
  audience: "Ideal customer",
  problem: "Problem solved",
  usp: "USP",
  competitors: "Top competitors",
  tone: "Brand tone",
  platforms: "Active platforms",
  postsPerMonth: "Posts last month",
  currentMaker: "Currently made by",
  avgPerformance: "Avg performance",
  whatNotWorking: "Not working",
  topClips: "Top clips",
  adSpend: "Monthly ad spend",
  services: "Services interested in",
  volume: "Clips/month target",
  multilingual: "Multilingual",
  includeStrategy: "Scope wanted",
  mainGoal: "Main goal",
  goal90Days: "90-day goal",
  successMetric: "Success metric",
  tracking: "Tracking setup",
  brandAssets: "Brand assets links",
  refsLove: "References — love",
  refsHate: "References — dislike",
  music: "Music vibe",
  restrictions: "Brand do's & don'ts",
  hasScripts: "Has scripts/hooks",
  timeline: "Timeline",
  engagement: "Engagement model",
  budget: "Monthly budget",
  name: "Name",
  role: "Role",
  email: "Email",
  phone: "Phone",
  preferredChannel: "Preferred channel",
  additional: "Additional",
};

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function renderField(key: string, value: string | string[]): string {
  const label = FIELD_LABELS[key] ?? key;
  const text = Array.isArray(value) ? value.join(", ") : value;
  if (!text || !text.trim()) return "";
  const escaped = escapeHtml(text).replace(/\n/g, "<br>");
  return `
    <tr>
      <td style="padding:8px 12px;border-bottom:1px solid #1e1e1c;color:#9a958e;font-size:11px;text-transform:uppercase;letter-spacing:0.18em;font-family:monospace;width:200px;vertical-align:top">${label}</td>
      <td style="padding:8px 12px;border-bottom:1px solid #1e1e1c;color:#ece8e1;font-size:14px;line-height:1.55;vertical-align:top">${escaped}</td>
    </tr>
  `;
}

export async function submitBrief(data: BriefSubmission) {
  if (!data.email) {
    return { success: false, error: "Missing email" };
  }

  const rows = (Object.keys(FIELD_LABELS) as Array<keyof BriefSubmission>)
    .map((k) => renderField(k as string, data[k] as string | string[]))
    .filter(Boolean)
    .join("");

  const brandLabel = data.brand?.trim() || "(no brand)";
  const nameLabel = data.name?.trim() || "(no name)";
  const headerLine = [nameLabel, data.email, data.phone].filter((s) => s && s.trim()).join(" · ");

  const html = `
    <div style="background:#080808;color:#ece8e1;font-family:Arial,sans-serif;padding:32px">
      <div style="max-width:720px;margin:0 auto;background:#0d0d0d;border:1px solid #1e1e1c;border-radius:6px;overflow:hidden">
        <div style="padding:24px 28px;border-bottom:2px solid #c8ff00;background:linear-gradient(135deg,#0d0d0d 0%,#0a0a0a 100%)">
          <div style="font-family:monospace;font-size:11px;letter-spacing:0.3em;color:#c8ff00;text-transform:uppercase;margin-bottom:8px">VEKTO / NEW BRIEF</div>
          <h1 style="margin:0;font-size:22px;color:#fff">${escapeHtml(brandLabel)}</h1>
          <div style="margin-top:6px;color:#9a958e;font-size:13px">${escapeHtml(headerLine)}</div>
        </div>
        <table style="width:100%;border-collapse:collapse">${rows}</table>
        <div style="padding:16px 28px;background:#0a0a0a;color:#666;font-size:11px;font-family:monospace;letter-spacing:0.18em;text-transform:uppercase">
          Submitted in ${data.lang.toUpperCase()} · vektoagency.com/brief
        </div>
      </div>
    </div>
  `;

  try {
    await resend.emails.send({
      from: "VEKTO Brief <onboarding@resend.dev>",
      to: process.env.CONTACT_EMAIL!,
      subject: `[BRIEF] ${brandLabel} — ${nameLabel}`,
      html,
      replyTo: data.email,
    });
    return { success: true };
  } catch {
    return { success: false, error: "Failed to send" };
  }
}

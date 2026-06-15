import { NextResponse } from "next/server";
import { headers, cookies } from "next/headers";
import { fireMetaCapiEvent } from "../../lib/meta-capi";

/**
 * Client-triggered Meta Conversions API mirror.
 *
 * The browser pixel fires Schedule + Contact events directly via fbq;
 * this endpoint mirrors the same events server-side so users with iOS
 * ATT opt-outs / AdBlockers / cookie consent denials are still
 * captured. Browser and server fires share the same `eventID` so Meta
 * dedupes within its ~5 min window.
 *
 * Accepts only a whitelist of standard event names so the endpoint
 * can't be abused to inflate arbitrary custom conversions.
 */

const ALLOWED_EVENTS = ["Schedule", "Contact", "ViewContent"] as const;
type AllowedEvent = (typeof ALLOWED_EVENTS)[number];

type Body = {
  event: AllowedEvent;
  eventId: string;
  sourceUrl?: string;
  // Optional custom data forwarded to Meta as-is (no PII expected for
  // these events — they're triggered by anonymous button clicks).
  customData?: {
    contentName?: string;
    contentCategory?: string;
    value?: number;
    currency?: string;
  };
};

export async function POST(req: Request) {
  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ ok: false, error: "invalid json" }, { status: 400 });
  }

  if (!ALLOWED_EVENTS.includes(body.event)) {
    return NextResponse.json({ ok: false, error: "event not allowed" }, { status: 400 });
  }
  if (!body.eventId || typeof body.eventId !== "string") {
    return NextResponse.json({ ok: false, error: "missing eventId" }, { status: 400 });
  }

  const h = await headers();
  const c = await cookies();
  await fireMetaCapiEvent({
    eventName: body.event,
    eventId: body.eventId,
    eventSourceUrl: body.sourceUrl || h.get("referer") || "https://vektoagency.com/",
    userData: {
      fbp: c.get("_fbp")?.value,
      fbc: c.get("_fbc")?.value,
      clientIp:
        h.get("x-forwarded-for")?.split(",")[0]?.trim() ||
        h.get("x-real-ip") ||
        undefined,
      clientUserAgent: h.get("user-agent") || undefined,
    },
    customData: body.customData,
  });

  return NextResponse.json({ ok: true });
}

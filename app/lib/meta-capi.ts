/**
 * Meta Conversions API — server-side mirror of browser Pixel events.
 *
 * Sends events directly from the Next.js server to Meta's Graph API,
 * bypassing browser limitations: iOS 14.5+ ATT opt-outs, AdBlockers,
 * cookie consent denials, Safari private mode, mobile network drops.
 *
 * Used in tandem with the browser pixel (app/components/MetaPixel.tsx):
 * both fire the SAME event with the SAME event_id → Meta deduplicates,
 * counting each conversion once. Net effect: ~30-50% more conversions
 * captured + 5-10% lower CPM (documented Meta benefit for advertisers
 * running CAPI alongside Pixel).
 *
 * Docs: https://developers.facebook.com/docs/marketing-api/conversions-api
 */

import crypto from "node:crypto";

const META_GRAPH_API_VERSION = "v21.0";

type StandardEventName =
  | "PageView"
  | "Lead"
  | "Schedule"
  | "Contact"
  | "ViewContent"
  | "CompleteRegistration"
  | "InitiateCheckout"
  | "Purchase";

type UserData = {
  email?: string;        // will be hashed
  phone?: string;        // will be hashed
  firstName?: string;    // will be hashed
  lastName?: string;     // will be hashed
  city?: string;         // will be hashed
  country?: string;      // ISO 2-letter, lowercased, will be hashed
  // Pre-hashed identifiers from browser pixel — sent as-is for matching
  fbp?: string;          // _fbp cookie value
  fbc?: string;          // _fbc cookie value (from fbclid)
  // Network-level identifiers — not hashed, used for matching
  clientIp?: string;
  clientUserAgent?: string;
  // External ID (e.g., internal user id) — hashed
  externalId?: string;
};

type CapiEventInput = {
  eventName: StandardEventName;
  eventId: string;           // for browser/server dedup — must match client fbq event ID
  eventSourceUrl: string;    // e.g., https://vektoagency.com/start
  userData: UserData;
  customData?: {
    value?: number;
    currency?: string;       // ISO 4217 (e.g., "EUR")
    contentName?: string;
    contentCategory?: string;
    contentIds?: string[];
    contents?: Array<{ id: string; quantity?: number; item_price?: number }>;
    numItems?: number;
  };
  /**
   * When set, the event is only visible in Events Manager's "Test events"
   * tab (not in regular reporting). Used to verify wiring during setup.
   */
  testEventCode?: string;
};

/** SHA-256 hash, hex-encoded — Meta's required format for PII. */
function sha256(value: string): string {
  return crypto
    .createHash("sha256")
    .update(value.trim().toLowerCase())
    .digest("hex");
}

function buildUserData(u: UserData): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  if (u.email) out.em = [sha256(u.email)];
  if (u.phone) out.ph = [sha256(u.phone.replace(/[^\d+]/g, ""))];
  if (u.firstName) out.fn = [sha256(u.firstName)];
  if (u.lastName) out.ln = [sha256(u.lastName)];
  if (u.city) out.ct = [sha256(u.city)];
  if (u.country) out.country = [sha256(u.country.toLowerCase())];
  if (u.externalId) out.external_id = [sha256(u.externalId)];
  // Not hashed (per Meta spec):
  if (u.fbp) out.fbp = u.fbp;
  if (u.fbc) out.fbc = u.fbc;
  if (u.clientIp) out.client_ip_address = u.clientIp;
  if (u.clientUserAgent) out.client_user_agent = u.clientUserAgent;
  return out;
}

/**
 * Fires a single Meta Conversions API event. Returns Meta's response
 * (events_received, fbtrace_id) for logging. Throws on network errors;
 * Meta API errors are logged but not thrown — failed CAPI fires should
 * never break the user-facing flow (form submit, etc.).
 */
export async function fireMetaCapiEvent(input: CapiEventInput): Promise<void> {
  const pixelId = process.env.META_PIXEL_ID;
  const accessToken = process.env.META_CAPI_ACCESS_TOKEN;

  if (!pixelId || !accessToken) {
    // Don't fail the request — just log and skip. Useful for local dev
    // without the env vars set.
    console.warn("[meta-capi] missing META_PIXEL_ID or META_CAPI_ACCESS_TOKEN, skipping fire");
    return;
  }

  const url = `https://graph.facebook.com/${META_GRAPH_API_VERSION}/${pixelId}/events`;

  const payload = {
    data: [
      {
        event_name: input.eventName,
        event_time: Math.floor(Date.now() / 1000),
        event_id: input.eventId,
        event_source_url: input.eventSourceUrl,
        action_source: "website",
        user_data: buildUserData(input.userData),
        ...(input.customData && {
          custom_data: {
            ...(input.customData.value !== undefined && { value: input.customData.value }),
            ...(input.customData.currency && { currency: input.customData.currency }),
            ...(input.customData.contentName && { content_name: input.customData.contentName }),
            ...(input.customData.contentCategory && { content_category: input.customData.contentCategory }),
            ...(input.customData.contentIds && { content_ids: input.customData.contentIds }),
            ...(input.customData.contents && { contents: input.customData.contents }),
            ...(input.customData.numItems !== undefined && { num_items: input.customData.numItems }),
          },
        }),
      },
    ],
    ...(input.testEventCode && { test_event_code: input.testEventCode }),
    access_token: accessToken,
  };

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      // Don't let a slow CAPI call block the user response.
      signal: AbortSignal.timeout(4000),
    });
    if (!res.ok) {
      const body = await res.text().catch(() => "<unreadable>");
      console.error(`[meta-capi] ${input.eventName} fire failed: ${res.status}`, body);
      return;
    }
    const json = (await res.json().catch(() => ({}))) as {
      events_received?: number;
      fbtrace_id?: string;
    };
    console.log(
      `[meta-capi] ${input.eventName} fired → events_received=${json.events_received ?? "?"} trace=${json.fbtrace_id ?? "?"}`
    );
  } catch (err) {
    // Network failure / timeout. Don't surface to user — pixel still
    // fires client-side as backup.
    console.error(`[meta-capi] ${input.eventName} network error`, err);
  }
}

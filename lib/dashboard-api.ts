// API client for the Vekto dashboard. Talks to the Fastify backend.
// In dev: NEXT_PUBLIC_DASHBOARD_API = http://localhost:3001
// In prod: NEXT_PUBLIC_DASHBOARD_API = https://api.vektoagency.com (or wherever backend is hosted)

const API_BASE =
  process.env.NEXT_PUBLIC_DASHBOARD_API ?? "http://localhost:3001";

async function call<T>(
  path: string,
  init: RequestInit = {}
): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    credentials: "include",
    headers: {
      ...(init.body && !(init.body instanceof FormData)
        ? { "Content-Type": "application/json" }
        : {}),
      ...init.headers,
    },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API ${res.status}: ${text}`);
  }
  return res.json() as Promise<T>;
}

export interface BriefListItem {
  id: string;
  client: string;
  product_name: string;
  brand_id: string | null;
  duration_hint: string | null;
  created_at: string;
  updated_at: string;
}

export type RunRating = "bad" | "edit" | "good";

export interface RunListItem {
  id: string;
  brief_id: string;
  status: "queued" | "running" | "succeeded" | "failed";
  drive_folder_url: string | null;
  output_path: string | null;
  client: string;
  product_name: string;
  total_usd: number | null;
  started_at: string;
  completed_at: string | null;
  error: string | null;
  rating: RunRating | null;
  rating_note: string | null;
  rated_at: string | null;
}

export const api = {
  // Auth
  async login(password: string): Promise<{ ok: true }> {
    return call("/api/dashboard/login", {
      method: "POST",
      body: JSON.stringify({ password }),
    });
  },
  async logout(): Promise<{ ok: true }> {
    return call("/api/dashboard/logout", { method: "POST" });
  },
  async me(): Promise<{ authenticated: boolean }> {
    return call("/api/dashboard/me");
  },

  // Intake
  async intakeFile(file: File): Promise<{
    brief: any;
    warnings: string[];
    source_kind: string;
    source_filename: string;
  }> {
    const fd = new FormData();
    fd.append("file", file);
    return call("/api/dashboard/intake", { method: "POST", body: fd });
  },
  async intakeBatch(files: File[]): Promise<{
    results: Array<{ filename: string; brief?: any; warnings?: string[]; error?: string }>;
  }> {
    const fd = new FormData();
    for (const f of files) fd.append("files", f);
    return call("/api/dashboard/intake-batch", { method: "POST", body: fd });
  },
  async intakeText(text: string): Promise<{
    brief: any;
    warnings: string[];
    source_kind: string;
  }> {
    return call("/api/dashboard/intake", {
      method: "POST",
      body: JSON.stringify({ text }),
    });
  },

  // Briefs
  async saveBrief(brief: unknown): Promise<{ id: string; brief: unknown }> {
    return call("/api/dashboard/briefs", {
      method: "POST",
      body: JSON.stringify(brief),
    });
  },
  async listBriefs(): Promise<{ briefs: BriefListItem[] }> {
    return call("/api/dashboard/briefs");
  },
  async getBrief(id: string): Promise<{
    id: string;
    brief: any;
    created_at: string;
    updated_at: string;
  }> {
    return call(`/api/dashboard/briefs/${encodeURIComponent(id)}`);
  },
  async deleteBrief(id: string): Promise<{ ok: true }> {
    return call(`/api/dashboard/briefs/${encodeURIComponent(id)}`, {
      method: "DELETE",
    });
  },
  async runBrief(id: string): Promise<{ run_id: string }> {
    return call(`/api/dashboard/briefs/${encodeURIComponent(id)}/run`, {
      method: "POST",
    });
  },
  async cloneBrief(id: string): Promise<{ id: string; brief: any }> {
    return call(`/api/dashboard/briefs/${encodeURIComponent(id)}/clone`, {
      method: "POST",
    });
  },

  // Runs
  async listRuns(): Promise<{ runs: RunListItem[] }> {
    return call("/api/dashboard/runs");
  },
  async batchRun(briefIds: string[]): Promise<{
    queued: Array<{ brief_id: string; run_id: string }>;
    skipped: string[];
  }> {
    return call("/api/dashboard/runs/batch", {
      method: "POST",
      body: JSON.stringify({ brief_ids: briefIds }),
    });
  },
  async listActiveRuns(): Promise<{
    active: RunListItem[];
    queued: RunListItem[];
    concurrency_limit: number;
  }> {
    return call("/api/dashboard/runs/active");
  },
  async cancelRun(runId: string): Promise<{ ok: boolean; was?: string; status?: string }> {
    return call(`/api/dashboard/runs/${encodeURIComponent(runId)}/cancel`, {
      method: "POST",
    });
  },
  async rateRun(runId: string, rating: RunRating, note?: string): Promise<{ ok: boolean }> {
    return call(`/api/dashboard/runs/${encodeURIComponent(runId)}/rating`, {
      method: "POST",
      body: JSON.stringify({ rating, note }),
    });
  },
  async clearRating(runId: string): Promise<{ ok: boolean }> {
    return call(`/api/dashboard/runs/${encodeURIComponent(runId)}/rating`, {
      method: "DELETE",
    });
  },
  runSseUrl(runId: string): string {
    return `${API_BASE}/api/dashboard/runs/${encodeURIComponent(runId)}/sse`;
  },

  // Settings
  async getSettings(): Promise<{ concurrency_limit: number }> {
    return call("/api/dashboard/settings");
  },
  async setSettings(settings: { concurrency_limit?: number }): Promise<{ concurrency_limit: number }> {
    return call("/api/dashboard/settings", {
      method: "POST",
      body: JSON.stringify(settings),
    });
  },

  // Brands
  async listBrands(): Promise<{ brands: Brand[] }> {
    return call("/api/dashboard/brands");
  },
  async getBrand(id: string): Promise<{ brand: Brand }> {
    return call(`/api/dashboard/brands/${encodeURIComponent(id)}`);
  },
  async createBrand(brand: Partial<Brand>): Promise<{ brand: Brand }> {
    return call("/api/dashboard/brands", {
      method: "POST",
      body: JSON.stringify(brand),
    });
  },
  async updateBrand(id: string, brand: Partial<Brand>): Promise<{ brand: Brand }> {
    return call(`/api/dashboard/brands/${encodeURIComponent(id)}`, {
      method: "PUT",
      body: JSON.stringify(brand),
    });
  },
  async deleteBrand(id: string): Promise<{ ok: true }> {
    return call(`/api/dashboard/brands/${encodeURIComponent(id)}`, {
      method: "DELETE",
    });
  },
};

export interface BrandProduct {
  name: string;
  description?: string;
  category?: string;
  url?: string;
  image_urls?: string[];
  hero_features?: string[];
  personality?: string;
  use_context?: string;
  competitor_differentiator?: string;
  price_usd?: number;
  tagline?: string;
}

export interface Brand {
  id: string;
  slug: string;
  name: string;
  tone: string | null;
  target_audience: string | null;
  values: string[];
  dont: string[];
  voice_examples: string[];
  primary_color: string | null;
  logo_url: string | null;
  products: BrandProduct[];
  brand_library: unknown;
  created_at: string;
  updated_at: string;
}

export const apiBaseUrl = API_BASE;

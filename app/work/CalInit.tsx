"use client";

import { useEffect } from "react";
import { getCalApi } from "@calcom/embed-react";

export default function CalInit() {
  useEffect(() => {
    (async () => {
      const cal = await getCalApi({ namespace: "30min" });
      cal("ui", {
        theme: "dark",
        cssVarsPerTheme: {
          light: { "cal-brand": "#f4f4f4" },
          dark: { "cal-brand": "#f4f4f4" },
        },
        hideEventTypeDetails: false,
        layout: "month_view",
      });
    })();
  }, []);
  return null;
}

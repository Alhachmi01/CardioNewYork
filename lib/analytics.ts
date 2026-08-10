export type GuideVexaEventName =
  | "tool_view"
  | "tool_calculation"
  | "travel_pack_landing_open"
  | "travel_pack_lp_view"
  | "travel_pack_cta_click"
  | "locker_open"
  | "locker_complete"
  | "download_start"
  | "travel_budget_print";

type AnalyticsValue = string | number | boolean;
type AnalyticsDetail = Record<string, AnalyticsValue>;

declare global {
  interface Window {
    dataLayer?: Array<Record<string, AnalyticsValue>>;
  }
}

export function trackEvent(name: GuideVexaEventName, detail: AnalyticsDetail = {}) {
  if (typeof window === "undefined") return;

  const payload = { event: name, ...detail };
  window.dataLayer ??= [];
  window.dataLayer.push(payload);
  window.dispatchEvent(new CustomEvent("guidevexa:tool-event", {
    detail: { name, ...detail },
  }));
}

type HelpEventName =
  | "help_search_submitted"
  | "help_quick_term_clicked"
  | "help_article_opened"
  | "help_category_opened";

type HelpEventPayload = Record<string, string | number | boolean | null | undefined>;

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
  }
}

export function trackHelpEvent(event: HelpEventName, payload: HelpEventPayload = {}) {
  if (typeof window === "undefined") return;

  const normalizedPayload = {
    event,
    source: "help_center",
    ...payload,
    timestamp: new Date().toISOString(),
  };

  window.dataLayer?.push(normalizedPayload);
  window.dispatchEvent(new CustomEvent("help:analytics", { detail: normalizedPayload }));
}

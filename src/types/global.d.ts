export {};

declare global {
  interface Window {
    getMetaTrackingData: () => {
      fbp: string | null;
      fbc: string | null;
      fbclid: string | null;
    };
    getTrackingData: () => {
      utm_source: string | null;
      utm_medium: string | null;
      utm_campaign: string | null;
      utm_content: string | null;
      utm_term: string | null;
      utm_id: string | null;
    };
  }
}
export {};

declare global {
  interface Window {
    getMetaTrackingData: () => {
      fbp: string | null;
      fbc: string | null;
      fbclid: string | null;
    };
  }
}
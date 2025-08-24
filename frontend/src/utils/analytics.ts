export type AnalyticsEvent = {
  name: string;
  props?: Record<string, any>;
};

export const analytics = {
  track: ({ name, props }: AnalyticsEvent) => {
    // Minimal stub: replace with your analytics provider later
    // eslint-disable-next-line no-console
    console.log("[analytics]", name, props || {});
  },
};

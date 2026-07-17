export const ROUTES = {
  HOME: "/",
  ABOUT: "/about",
} as const;

export type Route = (typeof ROUTES)[keyof typeof ROUTES];

export const NAV_LINKS: ReadonlyArray<{ label: string; to: Route }> = [
  { label: "Home", to: ROUTES.HOME },
  { label: "About", to: ROUTES.ABOUT },
];

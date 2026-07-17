import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Client-side navigation preserves scroll position, which lands the reader
 * mid-page on a new route. Resets to the top whenever the path changes.
 */
export function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [pathname]);

  return null;
}

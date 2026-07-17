import { HashRouter, Route, Routes } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { ScrollToTop } from "@/components/ScrollToTop";
import { ROUTES } from "@/config/routes";
import { AboutPage } from "@/pages/AboutPage";
import { HomePage } from "@/pages/HomePage";
import { NotFoundPage } from "@/pages/NotFoundPage";

const CATCH_ALL_ROUTE = "*";

/**
 * HashRouter is deliberate: GitHub Pages serves static files with no rewrite
 * rules, so a BrowserRouter would 404 on refresh or deep links.
 */
export function App() {
  return (
    <HashRouter>
      <ScrollToTop />
      <Layout>
        <Routes>
          <Route path={ROUTES.HOME} element={<HomePage />} />
          <Route path={ROUTES.ABOUT} element={<AboutPage />} />
          <Route path={CATCH_ALL_ROUTE} element={<NotFoundPage />} />
        </Routes>
      </Layout>
    </HashRouter>
  );
}

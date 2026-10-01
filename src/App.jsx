import { lazy, Suspense, useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import PageMetadata from "./components/shared/PageMetadata";
import Home from "./pages/Home";
import { caseStudies } from "./data/caseStudies";

import Header from "./components/shared/header/Header";
import Footer from "./components/shared/footer/Footer";
import ScrollManager from "./components/shared/ScrollManager";
import { SpaceTransitionProvider } from "./components/shared/SpaceTransition";

// Everything except the homepage loads on demand, so a first visit only
// downloads what it shows. The most-visited next stops warm up when idle.
const loadWork = () => import("./pages/Work");
const loadHouse = () => import("./pages/HouseCaseStudy");
const UIKit = lazy(() => import("./pages/UIKit"));
const Studio = lazy(() => import("./pages/Studio"));
const StudioInquire = lazy(() => import("./pages/StudioInquire"));
const About = lazy(() => import("./pages/About"));
const Observations = lazy(() => import("./pages/Observations"));
const ObservationPost = lazy(() => import("./pages/ObservationPost"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Work = lazy(loadWork);
const HouseCaseStudy = lazy(loadHouse);
const ProjectCaseStudy = lazy(() => import("./pages/ProjectCaseStudy"));
const Resume = lazy(() => import("./pages/Resume"));
const Visual = lazy(() => import("./pages/Visual"));

export default function App() {
  const { pathname } = useLocation();
  const isKitPage = /^\/uikits?\/?$/.test(pathname);
  const isStudioPage = /^\/studio(\/inquire)?\/?$/.test(pathname);
  const hideChrome = isKitPage || isStudioPage;

  useEffect(() => {
    const warm = () => { loadWork(); loadHouse(); };
    if ("requestIdleCallback" in window) {
      const id = window.requestIdleCallback(warm, { timeout: 4000 });
      return () => window.cancelIdleCallback(id);
    }
    const id = window.setTimeout(warm, 2500);
    return () => window.clearTimeout(id);
  }, []);
  return (
    <SpaceTransitionProvider>
      <ScrollManager />
      <PageMetadata />
      {!hideChrome && <Header />}

      <Suspense fallback={<main className="route-loading" aria-busy="true" />}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/studio" element={<Studio />} />
        <Route path="/studio/inquire" element={<StudioInquire />} />
        <Route path="/uikit" element={<UIKit />} />
        <Route path="/uikits" element={<Navigate to="/uikit" replace />} />
        <Route path="/about" element={<About />} />
        <Route path="/observations" element={<Observations />} />
        <Route path="/observations/:slug" element={<ObservationPost />} />
        <Route path="/work" element={<Work />} />
        <Route path="/resume" element={<Resume variant="product" />} />
        <Route path="/resume/experience" element={<Resume variant="experience" />} />
        <Route path="/visual" element={<Visual />} />
        <Route path="/house" element={<HouseCaseStudy />} />
        <Route path="/usda" element={<ProjectCaseStudy study={caseStudies.usda} />} />
        <Route path="/athletico" element={<ProjectCaseStudy study={caseStudies.athletico} />} />
        <Route path="/copyright-accounting" element={<ProjectCaseStudy study={caseStudies.accounting} />} />
        <Route path="/portfolio-ecosystem" element={<ProjectCaseStudy study={caseStudies.portfolio} />} />
        <Route path="/wedding-identity" element={<ProjectCaseStudy study={caseStudies.wedding} />} />
        <Route path="/sultry-tips" element={<ProjectCaseStudy study={caseStudies.sultry} />} />
        <Route path="/library-of-congress" element={<ProjectCaseStudy study={caseStudies.libraryOfCongress} />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      </Suspense>
      {!hideChrome && <Footer />}
    </SpaceTransitionProvider>
  );
}

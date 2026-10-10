import { lazy, Suspense, useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import PageMetadata from "./components/shared/PageMetadata";
import Home from "./pages/Home";

import Header from "./components/shared/header/Header";
import Footer from "./components/shared/footer/Footer";
import ScrollManager from "./components/shared/ScrollManager";
import { SpaceTransitionProvider } from "./components/shared/SpaceTransition";
import { PERSONAL_ORIGIN, isStudioHost, isStudioPath } from "./lib/siteHost";

// Read once: the domain never changes while the app is open.
const studioHost = isStudioHost();

// Everything except the homepage loads on demand, so a first visit only
// downloads what it shows. The most-visited next stops warm up when idle,
// and any page starts loading the moment someone points at or tabs to a
// link to it, so the click itself feels instant.
const loaders = {
  work: () => import("./pages/Work"),
  house: () => import("./pages/HouseCaseStudy"),
  study: () => import("./pages/ProjectCaseStudy"),
  uikit: () => import("./pages/UIKit"),
  studio: () => import("./pages/Studio"),
  inquire: () => import("./pages/StudioInquire"),
  admission: () => import("./pages/StudioAdmission"),
  studioAbout: () => import("./pages/StudioAbout"),
  about: () => import("./pages/About"),
  observations: () => import("./pages/Observations"),
  post: () => import("./pages/ObservationPost"),
  resume: () => import("./pages/Resume"),
  visual: () => import("./pages/Visual"),
};
const STUDY_PATHS = new Set(["/usda", "/athletico", "/copyright-accounting", "/portfolio-ecosystem", "/wedding-identity", "/sultry-tips", "/library-of-congress"]);
const loaderFor = (path) => {
  const clean = path.replace(/\/+$/, "") || "/";
  if (STUDY_PATHS.has(clean)) return loaders.study;
  if (clean === "/house") return loaders.house;
  if (clean === "/work") return loaders.work;
  if (clean === "/uikit" || clean === "/uikits") return loaders.uikit;
  if (clean === "/studio") return loaders.studio;
  if (clean === "/studio/inquire") return loaders.inquire;
  if (clean === "/studio/admission") return loaders.admission;
  if (clean === "/studio/about") return loaders.studioAbout;
  if (clean === "/about") return loaders.about;
  if (clean === "/observations") return loaders.observations;
  if (clean.startsWith("/observations/")) return loaders.post;
  if (clean.startsWith("/resume")) return loaders.resume;
  if (clean === "/visual") return loaders.visual;
  return null;
};
const preloadLink = (event) => {
  const link = event.target.closest?.("a[href]");
  if (!link || link.origin !== window.location.origin) return;
  loaderFor(link.pathname)?.();
};

const UIKit = lazy(loaders.uikit);
const Studio = lazy(loaders.studio);
const StudioInquire = lazy(loaders.inquire);
const StudioAdmission = lazy(loaders.admission);
const StudioAbout = lazy(loaders.studioAbout);
const About = lazy(loaders.about);
const Observations = lazy(loaders.observations);
const ObservationPost = lazy(loaders.post);
const NotFound = lazy(() => import("./pages/NotFound"));
const Work = lazy(loaders.work);
const HouseCaseStudy = lazy(loaders.house);
const ProjectCaseStudy = lazy(loaders.study);
const Resume = lazy(loaders.resume);
const Visual = lazy(loaders.visual);

export default function App() {
  const { pathname } = useLocation();
  const isKitPage = /^\/uikits?\/?$/.test(pathname);
  const isStudioPage = /^\/studio(\/inquire|\/admission|\/about)?\/?$/.test(pathname) || (studioHost && pathname === "/");
  const leavesStudioDomain = studioHost && !isStudioPath(pathname);
  const hideChrome = isKitPage || isStudioPage;

  // A link inside the app to a portfolio page, followed on the Studio
  // domain, finishes on the portfolio's own domain.
  useEffect(() => {
    if (leavesStudioDomain) window.location.replace(PERSONAL_ORIGIN + pathname + window.location.search + window.location.hash);
  }, [leavesStudioDomain, pathname]);

  useEffect(() => {
    const warm = () => { loaders.work(); loaders.house(); loaders.study(); };
    if ("requestIdleCallback" in window) {
      const id = window.requestIdleCallback(warm, { timeout: 4000 });
      return () => window.cancelIdleCallback(id);
    }
    const id = window.setTimeout(warm, 2500);
    return () => window.clearTimeout(id);
  }, []);

  useEffect(() => {
    document.addEventListener("pointerover", preloadLink, { passive: true });
    document.addEventListener("focusin", preloadLink);
    return () => {
      document.removeEventListener("pointerover", preloadLink);
      document.removeEventListener("focusin", preloadLink);
    };
  }, []);
  return (
    <SpaceTransitionProvider>
      <ScrollManager />
      <PageMetadata />
      {!hideChrome && <Header />}

      <Suspense fallback={<main className="route-loading" aria-busy="true" />}>
      {leavesStudioDomain ? <main className="route-loading" aria-busy="true" /> : <Routes>
        <Route path="/" element={studioHost ? <Studio /> : <Home />} />
        <Route path="/studio" element={<Studio />} />
        <Route path="/studio/inquire" element={<StudioInquire />} />
        <Route path="/studio/admission" element={<StudioAdmission />} />
        <Route path="/studio/about" element={<StudioAbout />} />
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
        <Route path="/usda" element={<ProjectCaseStudy studyKey="usda" />} />
        <Route path="/athletico" element={<ProjectCaseStudy studyKey="athletico" />} />
        <Route path="/copyright-accounting" element={<ProjectCaseStudy studyKey="accounting" />} />
        <Route path="/portfolio-ecosystem" element={<ProjectCaseStudy studyKey="portfolio" />} />
        <Route path="/wedding-identity" element={<ProjectCaseStudy studyKey="wedding" />} />
        <Route path="/sultry-tips" element={<ProjectCaseStudy studyKey="sultry" />} />
        <Route path="/library-of-congress" element={<ProjectCaseStudy studyKey="libraryOfCongress" />} />
        <Route path="*" element={<NotFound />} />
      </Routes>}
      </Suspense>
      {!hideChrome && <Footer />}
    </SpaceTransitionProvider>
  );
}

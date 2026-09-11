import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import UIKit from "./pages/UIKit";

import Home from "./pages/Home";
import About from "./pages/About";
import Observations from "./pages/Observations";
import ObservationPost from "./pages/ObservationPost";
import NotFound from "./pages/NotFound";
import Work from "./pages/Work";
import HouseCaseStudy from "./pages/HouseCaseStudy";
import ProjectCaseStudy from "./pages/ProjectCaseStudy";
import { caseStudies } from "./data/caseStudies";

import Header from "./components/shared/header/Header";
import Footer from "./components/shared/footer/Footer";
import ScrollManager from "./components/shared/ScrollManager";

export default function App() {
  const { pathname } = useLocation();
  const isKitPage = /^\/uikits?\/?$/.test(pathname);
  return (
    <>
      <ScrollManager />
      {!isKitPage && <Header />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/uikit" element={<UIKit />} />
        <Route path="/uikits" element={<Navigate to="/uikit" replace />} />
        <Route path="/about" element={<About />} />
        <Route path="/observations" element={<Observations />} />
        <Route path="/observations/:slug" element={<ObservationPost />} />
        <Route path="/work" element={<Work />} />
        <Route path="/house" element={<HouseCaseStudy />} />
        <Route path="/usda" element={<ProjectCaseStudy study={caseStudies.usda} />} />
        <Route path="/athletico" element={<ProjectCaseStudy study={caseStudies.athletico} />} />
        <Route path="/copyright-accounting" element={<ProjectCaseStudy study={caseStudies.accounting} />} />
        <Route path="/library-of-congress" element={<ProjectCaseStudy study={caseStudies.libraryOfCongress} />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      {!isKitPage && <Footer />}
    </>
  );
}

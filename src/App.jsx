import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import About from "./pages/About";
import Observations from "./pages/Observations";
import NotFound from "./pages/NotFound";
import Work from "./pages/Work";
import HouseCaseStudy from "./pages/HouseCaseStudy";
import ProjectCaseStudy from "./pages/ProjectCaseStudy";
import { caseStudies } from "./data/caseStudies";

import Header from "./components/shared/header/Header";
import Footer from "./components/shared/footer/Footer";

export default function App() {
  return (
    <>
      <Header />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/observations" element={<Observations />} />
        <Route path="/work" element={<Work />} />
        <Route path="/house" element={<HouseCaseStudy />} />
        <Route path="/usda" element={<ProjectCaseStudy study={caseStudies.usda} />} />
        <Route path="/athletico" element={<ProjectCaseStudy study={caseStudies.athletico} />} />
        <Route path="/library-of-congress" element={<ProjectCaseStudy study={caseStudies.libraryOfCongress} />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </>
  );
}

import { initializeAnalytics } from "./lib/analytics";
import { initMotionPreference } from "./lib/motionPreference";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import "./styles/app.css";
import App from "./App";

import "@fontsource/space-grotesk/400.css";
import "@fontsource/space-grotesk/500.css";
import "@fontsource/space-grotesk/700.css";
import "./styles/responsive.css";

initializeAnalytics();
initMotionPreference();

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);

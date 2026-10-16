import { useCallback, useEffect, useEffectEvent, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { isMotionReduced, onMotionPreferenceChange } from "../../lib/motionPreference";
import { SpaceTransitionContext, useSpaceTransition } from "./spaceTransitionContext";
import { StudioMark, UIMark } from "./BrandMarks";
import StudioEye from "./StudioEye";
import AliHello from "../uikit/AliHello";
import stardust from "../../assets/branding/celestial/stardust-asteroid.webp";
import wordPro from "../../assets/branding/marks/omoniyi..svg";
import alimi from "../../assets/branding/marks/alimi-transition.svg";
import "./space-transition.css";

const IDLE = { phase: "idle", tone: "portfolio" };
// 360ms cover + 1100ms reading/character beat + 440ms lift = 1.9s.
const COVER_MS = 360;
const REVEAL_AT = 1460;
const END_AT = 1900;

function DestinationCard({ tone }) {
  return (
    <div className="space-curtain__stage">
      <div className={`space-curtain__character space-curtain__character--${tone}`}>
        {tone === "portfolio" ? <img src={stardust} width="160" height="160" alt="" /> :
          tone === "ui" ? <><AliHello /><span className="space-curtain__spark space-curtain__spark--one">✦</span><span className="space-curtain__spark space-curtain__spark--two">✦</span></> :
            <StudioEye size={104} className="space-curtain__dio" />}
      </div>
      {tone === "studio" ? <StudioMark variant="bare" /> : (
        <div className={`space-curtain__typing space-curtain__typing--${tone}`}>
          <div className="space-curtain__lettering">
            {tone === "ui" ? <UIMark variant="bare" /> : <div className="space-curtain__portfolio-mark">
              <img src={wordPro} width="139" height="36" alt="" />
              <span className="space-curtain__alimi"><img src={alimi} width="49" height="36" alt="" />
                <svg viewBox="0 0 49 36" fill="none"><path pathLength="1" d="M0.500152 28.1459C7.94244 24.6746 27.5185 21.103 46.0749 21.7279" stroke="#7569e3" strokeLinecap="round" /></svg>
              </span>
            </div>}
          </div>
          <span className="space-curtain__cursor" />
        </div>
      )}
    </div>
  );
}

export function SpaceTransitionProvider({ children }) {
  const navigate = useNavigate();
  const timers = useRef([]);
  const pending = useRef(null);
  const [curtain, setCurtain] = useState(IDLE);

  const clearTimers = useCallback(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  }, []);
  const reset = useCallback(() => {
    clearTimers();
    pending.current = null;
    setCurtain(IDLE);
  }, [clearTimers]);

  const finishReducedMotion = useEffectEvent(() => {
    if (!isMotionReduced()) return;
    const destination = pending.current;
    reset();
    if (destination && !destination.navigated) navigate(destination.path);
  });

  useEffect(() => {
    // History navigation wins over a pending destination, including before cover.
    window.addEventListener("popstate", reset);
    const off = onMotionPreferenceChange(finishReducedMotion);
    return () => {
      clearTimers();
      window.removeEventListener("popstate", reset);
      off();
    };
  }, [clearTimers, reset]);

  const goTo = useCallback((path, tone = "portfolio") => {
    if (pending.current) return;
    if (isMotionReduced()) { navigate(path); return; }
    const target = ["portfolio", "studio", "ui"].includes(tone) ? tone : "portfolio";
    pending.current = { path, navigated: false };
    setCurtain({ phase: "cover", tone: target });
    const at = (ms, fn) => timers.current.push(setTimeout(fn, ms));
    at(COVER_MS, () => {
      pending.current.navigated = true;
      navigate(path);
    });
    at(REVEAL_AT, () => setCurtain({ phase: "reveal", tone: target }));
    at(END_AT, reset);
  }, [navigate, reset]);

  return (
    <SpaceTransitionContext.Provider value={{ goTo }}>
      {children}
      <div className="space-curtain" data-phase={curtain.phase} data-tone={curtain.tone} aria-hidden="true">
        <div className="space-curtain__panel">
          {curtain.phase !== "idle" ? <DestinationCard tone={curtain.tone} /> : null}
        </div>
      </div>
    </SpaceTransitionContext.Provider>
  );
}

// Modified clicks, explicit targets and downloads retain native link behavior.
export function SpaceLink({ to, tone, onClick, children, ...props }) {
  const { goTo } = useSpaceTransition();
  const handleClick = (event) => {
    onClick?.(event);
    if (event.defaultPrevented) return;
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    if ((props.target && props.target !== "_self") || props.download != null) return;
    event.preventDefault();
    goTo(to, tone);
  };
  return <Link to={to} onClick={handleClick} {...props}>{children}</Link>;
}

import { createContext, useContext } from "react";

// Kept apart from SpaceTransition.jsx so that file only exports components
// (React Fast Refresh requirement).
export const SpaceTransitionContext = createContext(null);

export function useSpaceTransition() {
  const ctx = useContext(SpaceTransitionContext);
  if (!ctx) {
    throw new Error("useSpaceTransition must be used inside SpaceTransitionProvider");
  }
  return ctx;
}

import { useEffect, useState } from "react";
import { isMotionReduced, onMotionPreferenceChange } from "./motionPreference";

export default function useMotionReduced() {
  const [reduced, setReduced] = useState(() => isMotionReduced());
  useEffect(() => onMotionPreferenceChange(() => setReduced(isMotionReduced())), []);
  return reduced;
}

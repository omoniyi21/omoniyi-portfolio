import "./brand-marks.css";
import wordPro from "../../assets/branding/marks/omoniyi..svg";
import noteAlimi from "../../assets/branding/marks/alimi.svg";
import wordUiDark from "../../assets/branding/marks/omoniyi-ui.svg";
import wordUiLight from "../../assets/branding/marks/omoniyi-ui-white.svg";
import tagUiBlack from "../../assets/branding/marks/omoniyiui-black-square.svg";
import tagUiLavender from "../../assets/branding/marks/omoniyiui-lav-square.svg";
import StudioEye from "./StudioEye";

// The three practice marks from the Stardust brand sheet. variant:
// "light" / "dark" = the tiled versions (curtain, brand sheet), "bare" = the
// untiled lockup used in each space's header.
//
// Single-colour wordmarks are drawn as CSS masks so each can take the tile's
// ink colour (light and dark variants from one file). Multi-colour pieces
// (the lavender "alimi" note, the ui tags) are used as-is.
function Glyph({ src, w, h, className = "" }) {
  return <span className={`space-mark__glyph ${className}`} style={{ "--glyph": `url("${src}")`, width: w, height: h }} />;
}

export function ProfessionalMark({ variant }) {
  return (
    <div className={`space-mark space-mark--pro space-mark--${variant}`}>
      <Glyph src={wordPro} w={139} h={36} />
      <img className="space-mark__pro-note" src={noteAlimi} width="49" height="36" alt="" />
    </div>
  );
}

// Lockup B from the Studio Eye Mark canvas: the eye beside "Omoniyi" in
// Fraunces over a tracked STUDIO label. `awake` lets the curtain hold the
// eye drowsy while marks flash and lift it on arrival.
export function StudioMark({ variant, awake = true }) {
  return (
    <div className={`space-mark space-mark--studio space-mark--${variant}`}>
      <StudioEye size={44} awake={awake} />
      <span className="space-mark__studio-words">
        <span className="space-mark__studio-name">Omoniyi</span>
        <span className="space-mark__studio-label">Studio</span>
      </span>
    </div>
  );
}

export function UIMark({ variant }) {
  const light = variant !== "dark";
  return (
    <div className={`space-mark space-mark--ui space-mark--${variant}`}>
      <img src={light ? wordUiDark : wordUiLight} width="170" height="44" alt="" />
      <img src={light ? tagUiBlack : tagUiLavender} width="55" height="55" alt="" />
    </div>
  );
}

export function BrandMark({ space, variant = "bare" }) {
  if (space === "studio") return <StudioMark variant={variant} />;
  if (space === "ui") return <UIMark variant={variant} />;
  return <ProfessionalMark variant={variant} />;
}

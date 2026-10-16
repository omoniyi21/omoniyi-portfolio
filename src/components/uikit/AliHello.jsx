// Ali, Omoniyi UI's character, in his Hello pose. A stand-in drawn from the
// reference sheet until the hand-drawn Ali exists; swap this file then.
// Decorative: always aria-hidden.
export default function AliHello({ className = "" }) {
  return (
    <svg className={className} viewBox="20 40 220 270" aria-hidden="true" focusable="false">
      <ellipse cx="120" cy="300" rx="66" ry="6" fill="#ddd1ff" />
      <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
        <path d="M98 120 L86 76" strokeWidth="6" />
        <path d="M142 120 L156 72" strokeWidth="6" />
        <path d="M50 186 L34 226" strokeWidth="17" />
        <path d="M190 180 L214 140" strokeWidth="17" />
        <path d="M100 254 L98 282" strokeWidth="17" />
        <path d="M140 254 L142 282" strokeWidth="17" />
        <path d="M224 120 Q232 128 230 140" strokeWidth="3" />
      </g>
      <g fill="none" stroke="#ddd1ff" strokeLinecap="round">
        <path d="M50 186 L34 226" strokeWidth="9" />
        <path d="M190 180 L214 140" strokeWidth="9" />
        <path d="M100 254 L98 282" strokeWidth="9" />
        <path d="M140 254 L142 282" strokeWidth="9" />
      </g>
      <rect x="82" y="280" width="30" height="13" rx="6.5" fill="#ddd1ff" stroke="currentColor" strokeWidth="4" />
      <rect x="128" y="280" width="30" height="13" rx="6.5" fill="#ddd1ff" stroke="currentColor" strokeWidth="4" />
      <rect x="50" y="120" width="140" height="136" rx="30" fill="var(--ali-body, #7569E3)" stroke="currentColor" strokeWidth="8" />
      <rect x="53" y="122" width="139" height="136" rx="30" fill="none" stroke="currentColor" strokeWidth="2.4" transform="rotate(-1.5 120 188)" />
      <circle cx="83" cy="66" r="10" fill="#FF8DB6" stroke="currentColor" strokeWidth="4" />
      <circle cx="159" cy="62" r="10" fill="#ddd1ff" stroke="currentColor" strokeWidth="4" />
      <ellipse cx="100" cy="178" rx="13" ry="17" fill="#18140f" />
      <ellipse cx="140" cy="178" rx="13" ry="17" fill="#18140f" />
      <circle cx="96" cy="171" r="4.5" fill="#ffffff" />
      <circle cx="136" cy="171" r="4.5" fill="#ffffff" />
      <circle cx="76" cy="204" r="4" fill="#FF8DB6" />
      <circle cx="85" cy="207" r="4" fill="#FF8DB6" />
      <circle cx="155" cy="207" r="4" fill="#FF8DB6" />
      <circle cx="164" cy="204" r="4" fill="#FF8DB6" />
      <path d="M112 206 Q120 213 128 206" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
    </svg>
  );
}

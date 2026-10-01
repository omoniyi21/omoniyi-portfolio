import { BRAND_ICONS, LINE_ICONS } from "./iconData";

// One icon family for the personal pages: Guidance by Streamline, a fine
// signage line drawn in the current text colour. Every icon uses the same
// stroke weight so the set reads as one system. Decorative by default; pass
// a `label` when the icon is the only thing that names a control.
export function Icon({ name, size = 20, strokeWidth = 1.25, label, className = "", ...props }) {
  const icon = LINE_ICONS[name];
  if (!icon) return null;
  return (
    <svg
      className={`icon icon--${name} ${className}`.trim()}
      width={size}
      height={size}
      viewBox={`0 0 ${icon.width} ${icon.height}`}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      focusable="false"
      dangerouslySetInnerHTML={{ __html: icon.body }}
      {...props}
    />
  );
}

// Full-colour brand marks: the only colour accents among the icons.
export function BrandIcon({ name, size = 18, className = "", ...props }) {
  const icon = BRAND_ICONS[name];
  if (!icon) return null;
  return (
    <svg
      className={`brand-icon brand-icon--${name} ${className}`.trim()}
      width={size}
      height={(size * icon.height) / icon.width}
      viewBox={`0 0 ${icon.width} ${icon.height}`}
      aria-hidden="true"
      focusable="false"
      dangerouslySetInnerHTML={{ __html: icon.body }}
      {...props}
    />
  );
}

import { Link } from "react-router-dom";

// The element under every paper control: a router Link for pages on the
// site, a plain <a> for other sites, or a real <button> for forms. The
// paper look is only skin; what it does stays a native link or button.
// Only links to other sites open in a new tab.
export default function PaperAction({ to, href, type = "button", children, ...props }) {
  if (to) return <Link to={to} {...props}>{children}</Link>;
  if (href) {
    const external = /^https?:/.test(href);
    return <a href={href} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})} {...props}>{children}</a>;
  }
  return <button type={type} {...props}>{children}</button>;
}

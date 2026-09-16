import BrandSignature from "../components/shared/BrandSignature";
import SpaceSwitcher from "../components/shared/SpaceSwitcher";
import { trackEvent } from "../lib/analytics";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import Button from "../components/shared/button/Button";
import "./uikit.css";

const FREE_KIT = "https://www.figma.com/community/file/1679586204488729025";
const EDITIONS = [
  { id: "free", name: "LaunchKit Free", badge: "Available now", description: "A thoughtful first step for your next idea.", price: "$0", priceNote: "Free to get started", features: ["Reusable component foundations", "Light + dark styles", "Auto Layout for flexible layouts", "A starting point for your MVP"], note: "Open the free kit on Figma Community." },
  { id: "pro", name: "LaunchKit Pro", badge: "In the making", description: "A fuller system for the product you’re building.", price: "$49", priceNote: "Planned founding price", features: ["18 component families · 160+ variants", "5 reusable product patterns", "6 starter screens", "Light + dark · semantic variables"], note: "Planned release scope. Join for availability updates." },
];

function FreeLink() {
  return <Button to={FREE_KIT} className="oui-button" target="_blank" rel="noopener noreferrer">Get LaunchKit Free</Button>;
}

function Playground() {
  const [theme, setTheme] = useState("light");
  const [saved, setSaved] = useState(false);
  const [workspace, setWorkspace] = useState("My next big idea");
  const [updates, setUpdates] = useState(true);
  return (
    <section className="oui-play-section oui-container" id="playground" aria-label="Interactive component playground">
      <div className="oui-playground" data-theme={theme}>
        <div className="oui-demo-toolbar">
          <p className="oui-eyebrow">The component playground</p>
          <div className="oui-theme-controls" role="group" aria-label="Demo color theme">
            <button aria-pressed={theme === "light"} onClick={() => setTheme("light")}><span aria-hidden="true">☀</span> Light</button>
            <button aria-pressed={theme === "dark"} onClick={() => setTheme("dark")}><span aria-hidden="true">☾</span> Dark</button>
          </div>
        </div>
        <div className="oui-demo-grid">
          <article className="oui-demo-card oui-button-demo">
            <p className="oui-small oui-muted">01 / A little button therapy</p>
            <h2>Every state.<br />Considered.</h2>
            <Button className="oui-button" icon={false} onClick={() => setSaved(!saved)}>{saved ? "✓ Changes saved" : "Save changes →"}</Button>
            <p className="oui-small oui-muted oui-save-message" role="status">{saved ? "Your updates are ready to go." : "Go on. Give it a click."}</p>
          </article>
          <article className="oui-demo-card oui-form-demo">
            <p className="oui-small oui-muted">02 / Less friction</p>
            <h3>Make it yours</h3>
            <label className="oui-field"><span>Workspace name</span><input value={workspace} maxLength={40} onChange={event => { setWorkspace(event.target.value); setSaved(false); }} /></label>
            <div className="oui-switch-row"><span>Product updates</span><button type="button" role="switch" aria-checked={updates} aria-label="Demo product updates" className="oui-switch" onClick={() => { setUpdates(!updates); setSaved(false); }}><span aria-hidden="true">●</span> {updates ? "On" : "Off"}</button></div>
            <p className="oui-small oui-muted">Clear labels. Helpful defaults.</p>
          </article>
          <article className="oui-demo-card oui-project-demo">
            <p className="oui-small oui-muted">03 / Everything connects</p>
            <span className="oui-badge oui-badge--green">✦ In progress</span>
            <h3>Version one</h3>
            <p className="oui-small oui-muted">From a blank canvas to<br />something you can share.</p>
            <div className="oui-project-bottom"><span>8 of 12 tasks</span><span aria-hidden="true">↗</span></div>
          </article>
        </div>
        <p className="oui-demo-hint">Try it: switch the theme · hover a button · save your changes</p>
      </div>
      <ul className="oui-capability-strip" aria-label="Kit foundations">{["Made in Figma", "Auto Layout", "Semantic variables", "Light + dark"].map(label => <li key={label}>{label}</li>)}</ul>
    </section>
  );
}

function ScreenPreview() {
  return <figure className="oui-preview" aria-label="Illustrative starter screen showing connected UI patterns">
    <div className="oui-app-window">
      <div className="oui-app-sidebar" aria-hidden="true"><strong>✦ Orbit</strong><span>Overview</span><span>Projects</span><span>Team</span><span>Settings</span></div>
      <div className="oui-app-main">
        <div className="oui-app-heading"><h3>Good morning, Alex</h3><span className="oui-badge">＋ Create</span></div>
        <p>Here’s what’s moving forward.</p>
        <div className="oui-metrics">{[["Active projects", "12"], ["Ready to ship", "04"], ["Completed", "28"]].map(([label, value]) => <div key={label}><span>{label}</span><strong>{value}</strong></div>)}</div>
        <h4>Your projects</h4>
        <div className="oui-app-projects">{[["Website refresh", "In review"], ["Mobile onboarding", "In progress"], ["Version one", "Ready to ship"]].map(([name, status]) => <div key={name}><span>{name}</span><span className={`oui-badge ${status === "Ready to ship" ? "oui-badge--green" : ""}`}>{status}</span></div>)}</div>
      </div>
    </div>
    <figcaption>Same foundations. A whole new starting point.<span>Illustrative component preview</span></figcaption>
  </figure>;
}

function ReleaseDialog({ onClose }) {
  const dialog = useRef(null);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");
  useEffect(() => {
    const element = dialog.current;
    const previousFocus = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    element.showModal();
    document.body.style.overflow = "hidden";
    return () => { element.close(); document.body.style.overflow = previousOverflow; previousFocus?.focus(); };
  }, []);

  async function submit(event) {
    event.preventDefault();
    if (status === "sending") return;
    const data = new FormData(event.currentTarget);
    setStatus("sending"); setError("");
    try {
      const response = await fetch("/.netlify/functions/launchkit-signup", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: String(data.get("email")).trim(), website: String(data.get("bot-field") || ""), list: "pro-waitlist", source: "https://omoniyialimi.com/uikit" }),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok || !result.ok) throw new Error(result.error || "Your request couldn’t be saved. Please try again or email me directly.");
      setStatus("success");
      trackEvent("launchkit_pro_signup", { form_name: "launchkit_pro" });
    } catch (err) { setError(err.message); setStatus("error"); }
  }

  return <dialog ref={dialog} className="oui-dialog" aria-labelledby="oui-release-title" onCancel={onClose} onClick={event => { if (event.target === event.currentTarget) { const rect = event.currentTarget.getBoundingClientRect(); if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) onClose(); } }}>
    <div className="oui-dialog-top"><span>✦ LaunchKit Pro</span><button type="button" className="oui-close" aria-label="Close release form" onClick={onClose}>×</button></div>
    {status === "success" ? <div className="oui-dialog-body" role="status"><h2 id="oui-release-title">You’re on the list.</h2><p>I’ll let you know when LaunchKit Pro is ready. In the meantime, start building with Free.</p><FreeLink /></div> : <form data-analytics-form="launchkit_pro" onSubmit={submit} className="oui-dialog-body">
      <h2 id="oui-release-title">Meet your next<br />starting point.</h2><p>Get an update when LaunchKit Pro is ready. Planned founding price: $49.</p>
      <label className="oui-field"><span>Email address</span><input type="email" name="email" placeholder="you@example.com" required maxLength={254} autoComplete="email" autoFocus disabled={status === "sending"} /></label>
      <label className="oui-honeypot" aria-hidden="true">Website<input name="bot-field" tabIndex={-1} autoComplete="off" /></label>
      <label className="oui-consent"><input type="checkbox" required disabled={status === "sending"} /> <span>Email me when LaunchKit Pro is ready.</span></label>
      {error && <p className="oui-form-error" role="alert">{error}</p>}
      <Button className="oui-button" type="submit" disabled={status === "sending"} icon={false}>{status === "sending" ? "Saving your request…" : "Notify me about Pro →"}</Button>
      <p className="oui-small">One launch update from Omoniyi. To opt out, email <a href="mailto:contact@omoniyialimi.com">contact@omoniyialimi.com</a>.</p>
    </form>}
  </dialog>;
}

export default function UIKit() {
  const [showRelease, setShowRelease] = useState(false);
  const page = useRef(null);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) return;
    const observer = new IntersectionObserver(entries => { entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add("oui-revealed"); observer.unobserve(entry.target); } }); }, { threshold: 0.08 });
    page.current.querySelectorAll("[data-reveal]").forEach(element => observer.observe(element));
    return () => observer.disconnect();
  }, []);
  return <div className="oui-page" ref={page}>
    <a href="#oui-main" className="oui-skip">Skip to content</a>
    <header className="oui-nav oui-container"><div className="ecosystem-lockup"><BrandSignature space="ui" /><SpaceSwitcher space="ui" /></div><nav aria-label="UI kit navigation"><a href="#kits">UI kits</a><a href="#playground">Playground</a><a href="#editions">Free vs Pro</a></nav><div className="oui-nav-cta"><FreeLink /></div><a className="oui-mobile-nav" href="#editions">Kits ↓</a></header>
    <main id="oui-main">
      <section className="oui-hero oui-container"><span className="oui-badge oui-badge--pink">Designed by Omoniyi / Built for your next idea</span><h1>Good ideas deserve<br /> a head start.</h1><p>Thoughtful Figma UI kits for getting version one out the door.<br className="oui-desktop-break" /> Reusable components. Clear systems. Room to make it yours.</p><div className="oui-actions"><FreeLink /><Button to="#editions" variant="secondary" className="oui-button" icon={false}>Explore Pro →</Button></div><p className="oui-small">Start with Free. Grow into Pro. Make something worth shipping.</p></section>
      <Playground />
      <section className="oui-product oui-section" id="kits"><div className="oui-container" data-reveal><div className="oui-section-top"><p className="oui-eyebrow">01 / The first kit in the collection</p><span className="oui-eyebrow">Figma UI kit ↗</span></div><div className="oui-product-grid"><div className="oui-product-copy"><span className="oui-badge">✦ LaunchKit UI</span><h2>Your version one,<br />with a head start.</h2><p>The UI system for getting version one out the door. Start with reusable foundations, then connect the pieces into a product that feels like you.</p><ol className="oui-feature-lines"><li>Components you can make your own</li><li>Consistent patterns, screen to screen</li><li>Light + dark, built into the system</li></ol><Button to="#editions" className="oui-button" icon={false}>Choose your LaunchKit →</Button></div><ScreenPreview /></div></div></section>
      <section className="oui-editions oui-section oui-container" id="editions" data-reveal><p className="oui-eyebrow">02 / Find your starting point</p><div className="oui-editions-intro"><h2>Start free.<br />Go further with Pro.</h2><p>One system, two ways in. Explore the foundations today, then grow into patterns and starter screens as your product takes shape.</p></div><div className="oui-edition-grid">{EDITIONS.map(edition => <article key={edition.id} className={`oui-edition oui-edition--${edition.id}`}><span className={`oui-badge ${edition.id === "free" ? "oui-badge--green" : "oui-badge--white"}`}>{edition.badge}</span><h3>{edition.name}</h3><p>{edition.description}</p><div className="oui-price"><strong>{edition.price}</strong><span>{edition.priceNote}</span></div><ul>{edition.features.map(feature => <li key={feature}><span aria-hidden="true">✓</span>{feature}</li>)}</ul>{edition.id === "free" ? <FreeLink /> : <Button className="oui-button" variant="secondary" icon={false} onClick={() => setShowRelease(true)}>Notify me about Pro →</Button>}<p className="oui-small oui-edition-note">{edition.note}</p></article>)}</div><p className="oui-small oui-collection-note">A growing collection, one useful kit at a time. More kits will live here as they’re ready.</p></section>
      <section className="oui-maker oui-section"><div className="oui-container oui-maker-grid" data-reveal><span className="oui-maker-star" aria-hidden="true">✦</span><div><p className="oui-eyebrow">A note from Omoniyi</p><h2>Deeply opinionated about the details.<br />So you can focus on the idea.</h2><p>I make complex systems feel clear, useful, and human. Omoniyi UI brings that same care to the components you use and reuse every day.</p><p className="oui-small">Omoniyi Alimi / Product designer & system thinker</p></div></div></section>
      <section className="oui-faq oui-section"><div className="oui-container oui-faq-grid" data-reveal><h2>A few things<br />you might<br className="oui-desktop-break" /> be wondering.</h2><div>{[["Where do I start?", "Start with LaunchKit Free on Figma Community. Explore the foundations, then adapt them to your next idea."], ["Is LaunchKit Pro available?", "Pro is in the making. Join the release list for an update when it’s ready. The planned founding price is $49."], ["Can I make it feel like my brand?", "That’s the idea. Use the editable components and shared styles as a starting point, then shape the details around your product."]].map(([question, answer]) => <article key={question}><h3>{question}</h3><p>{answer}</p></article>)}</div></div></section>
      <section className="oui-closing oui-section"><div className="oui-container" data-reveal><h2>Make room for your next good idea.</h2><FreeLink /><p className="oui-small">Start small. Make it yours.</p></div></section>
    </main>
    <footer className="oui-footer oui-container"><Link className="oui-wordmark" to="/uikit">✦ Omoniyi UI</Link><Link to="/">Portfolio ↗</Link><a href={FREE_KIT} target="_blank" rel="noopener noreferrer">Figma Community ↗</a><span>Made with care in Dallas, TX</span></footer>
    {showRelease && <ReleaseDialog onClose={() => setShowRelease(false)} />}
  </div>;
}

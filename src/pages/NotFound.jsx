import { Link } from "react-router-dom";
import confusedStardust from "../assets/branding/stardust-creature-kit/png/1024/lost-confused.png";
import "./not-found.css";

export default function NotFound() {
  return (
    <main className="not-found" aria-labelledby="not-found-title">
      <div className="not-found__dust not-found__dust--one" aria-hidden="true" />
      <div className="not-found__dust not-found__dust--two" aria-hidden="true" />

      <section className="not-found__panel">
        <p className="not-found__eyebrow">404 · LOST IN THE CONSTELLATION <span>✦</span></p>
        <img
          className="not-found__stardust"
          src={confusedStardust}
          alt="Stardust looking confused beside two question marks"
        />
        <div className="not-found__copy">
          <h1 id="not-found-title">I guess we’re<br />both lost?</h1>
          <p>Let’s find the way together.</p>
        </div>
        <div className="not-found__actions" aria-label="Choose where to go next">
          <Link className="not-found__action not-found__action--primary" to="/#contact">
            Message me <span aria-hidden="true">↗</span>
          </Link>
          <Link className="not-found__action not-found__action--secondary" to="/">
            Go home <span aria-hidden="true">←</span>
          </Link>
        </div>
        <p className="not-found__note">SD’s trail got a little tangled. It happens.</p>
      </section>
    </main>
  );
}

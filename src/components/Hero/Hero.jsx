import "./hero.css";

function Hero() {
  return (
    <section className="hero">
      <div className="hero__content">
        <p className="hero__eyebrow">
          Product Designer · Dallas, TX
        </p>

        <h1 className="hero__title">
          Helping people
          <br />
          navigate
          <br />
          complex systems.
        </h1>

        <p className="hero__description">
          I create systems, products, and experiences with clarity
          and beauty.
        </p>

        <a href="#work" className="hero__button">
          View Selected Work
        </a>
      </div>
    </section>
  );
}

export default Hero;
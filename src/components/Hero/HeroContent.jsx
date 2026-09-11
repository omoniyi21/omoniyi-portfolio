import Button from "../shared/button/Button";

export default function HeroContent() {

    return (

        <div className="hero__content">
            <span className="hero-journal__name">Omoniyi Alimi</span>
            <p className="hero__eyebrow">
                <span>Senior product designer</span>

                <span className="hero__eyebrow-star" aria-hidden="true">✦</span>
            </p>

            <h1 className="hero__title">
                <span>I help people</span>
                <span>navigate</span>
                <span>complex systems.</span>
            </h1>

            <p className="hero__description">
                I create products &amp; experiences with clarity and beauty.
            </p>

            <Button className="hero__button" to="/work">
                Explore my work
            </Button>
            <p className="hero-journal__note">a whole inner world, connected.</p>

        </div>

    );

}

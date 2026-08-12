import Button from "../shared/button/Button";

export default function HeroContent() {

    return (

        <div className="hero__content">
            <p className="hero__eyebrow">
                <span>01</span>
                <span>Omoniyi Alimi</span>
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

            <Button className="hero__button">
                explore my case studies
            </Button>

        </div>

    );

}

import Button from "../shared/button/Button";

export default function HeroContent() {

    return (

        <div className="hero__content">

            <span className="hero__eyebrow">

                Senior Product Designer

            </span>

            <h1 className="hero__title">

                I help people
                <br />

                navigate
                <br />

                <span className="hero__highlight">
                    complex systems.
                </span>

            </h1>

            <p className="hero__description">

                I create products & experiences with clarity and beauty.

            </p>

            <Button>

                explore case studies

            </Button>

        </div>

    );

}
import Button from "../button/Button";

export default function HeroContent() {

    return (

        <div className="hero__content">

            <span className="hero__eyebrow">

                Senior Product Designer

            </span>

            <h1 className="hero__title">

                Designing products
                <br />

                that bring

                <span className="hero__highlight">

                    clarity to complexity.

                </span>

            </h1>

            <p className="hero__description">

                Through research, systems thinking,
                accessibility, and thoughtful interaction
                design, I help organizations simplify
                complex digital experiences.

            </p>

            <Button>

                View my work

            </Button>

        </div>

    );

}
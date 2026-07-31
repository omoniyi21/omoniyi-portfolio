import clsx from "clsx";

import Stamp from "../stamp/Stamp";

import "./project-card.css";

export default function ProjectCard({
    image,
    alt,
    stamp,
    pattern = "clean",
    title,
    description,
    children,
    className
}) {
    return (
        <article
            className={clsx(
                "project-card",
                className
            )}
        >
            <figure className="project-card__media">

                <img
                    src={image}
                    alt={alt}
                    className="project-card__image"
                />

            </figure>

            <div className="project-card__content">

                <Stamp className={`pattern--${pattern}`}>
                    {stamp}
                </Stamp>

                <h3 className="project-card__title">
                    {title}
                </h3>

                <p className="project-card__description">
                    {description}
                </p>

                {children}

            </div>

        </article>
    );
}
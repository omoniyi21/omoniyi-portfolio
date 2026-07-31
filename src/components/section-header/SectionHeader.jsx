import clsx from "clsx";
import "./section-header.css";

export default function SectionHeading({
    title,
    description,
    align = "left",
    className
}) {
    return (
        <header
            className={clsx(
                "section-header",
                `section-header--${align}`,
                className
            )}
        >
            <h2 className="section-header__title">
                {title}
            </h2>

            {description && (
                <p className="section-header__description">
                    {description}
                </p>
            )}
        </header>
    );
}
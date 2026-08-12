import clsx from "clsx";
import "./section-header.css";

export default function SectionHeader({
    number,
    eyebrow,
    title,
    description,
    action,
    actionHref = "#",
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
            data-section-number={number}
        >

            {(number || eyebrow) && (
                <div className="section-header__meta">

                    {number && (
                        <span className="section-header__number">
                            {number}
                        </span>
                    )}

                    {eyebrow && (
                        <span className="section-header__eyebrow">
                            {eyebrow}
                            <span className="section-header__eyebrow-glyph" aria-hidden="true">✦</span>
                        </span>
                    )}

                </div>
            )}

            <h2 className="section-header__title">
                {title}
            </h2>

            {description && (
                <p className="section-header__description">
                    {description}
                </p>
            )}

            {action && (
                <a
                    href={actionHref}
                    className="section-header__action"
                >
                    {action}
                </a>
            )}

        </header>
    );
}

import clsx from "clsx";
import "./stamp.css";

export default function Stamp({
    children,
    className,
    ...props
}) {
    return (
        <span
            className={clsx(
                "stamp",
                "surface--paper",
                className
            )}
            {...props}
        >
            <span className="stamp__label">
                {children}
            </span>
        </span>
    );
}
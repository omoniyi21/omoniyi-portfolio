import { useEffect, useId, useRef, useState } from "react";
import "./header.css";

import logoMark from "../../../assets/branding/logo-mark.svg";
import stardustPeek from "../../../assets/branding/stardust-creature-kit/svg/nav-peek.svg";
import Navigation from "./Navigation";
import { Plus } from "lucide-react";

export default function Header() {
    const [open, setOpen] = useState(false);
    const menuId = useId();
    const headerRef = useRef(null);
    const triggerRef = useRef(null);

    useEffect(() => {
        const handlePointerDown = (event) => {
            if (!headerRef.current?.contains(event.target)) setOpen(false);
        };

        const handleKeyDown = (event) => {
            if (event.key === "Escape" && open) {
                setOpen(false);
                triggerRef.current?.focus();
            }
        };

        document.addEventListener("pointerdown", handlePointerDown);
        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("pointerdown", handlePointerDown);
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [open]);

    return (

        <header
          className={`site-header ${open ? "is-open" : ""}`}
          ref={headerRef}
        >
          <img className="header-stardust" src={stardustPeek} alt="" aria-hidden="true" />
          <button
            ref={triggerRef}
            className="site-brand"
            type="button"
            onClick={() => setOpen((isOpen) => !isOpen)}
            aria-expanded={open}
            aria-controls={menuId}
            aria-label={open ? "Close navigation menu" : "Open navigation menu"}
          >
            <img className="site-brand__mark" src={logoMark} alt="" />
            <span className="site-brand__wordmark" aria-hidden="true">omoniyi.</span>
            <Plus size={18} strokeWidth={1.75} className={`menu-icon ${open ? "open" : ""}`} />
          </button>

            <Navigation id={menuId} open={open} onNavigate={() => setOpen(false)} />

        </header>

    );

}

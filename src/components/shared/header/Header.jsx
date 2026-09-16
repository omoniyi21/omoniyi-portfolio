import { useEffect, useId, useRef, useState } from "react";
import "./header.css";




import BrandSignature from "../BrandSignature";

import Navigation from "./Navigation";
import logoMark from "../../../assets/branding/logo-mark.svg";
import { X } from "lucide-react";

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

        <>
        <div className="portfolio-signature"><BrandSignature space="portfolio" /></div>
        <header
          className={`portfolio-floating-menu ${open ? "is-open" : ""}`}
          ref={headerRef}
        >
          <button
            ref={triggerRef}
            className="portfolio-menu-toggle"
            type="button"
            onClick={() => setOpen((isOpen) => !isOpen)}
            aria-expanded={open}
            aria-controls={menuId}
            aria-label={open ? "Close navigation menu" : "Open navigation menu"}
          >
            <span className="portfolio-menu-label">{open ? "Close" : "Menu"}</span>
            <span className="portfolio-menu-orb">{open ? <X size={22} aria-hidden="true" /> : <img src={logoMark} alt="" aria-hidden="true" />}</span>
          </button>

            <Navigation id={menuId} open={open} onNavigate={() => setOpen(false)} />

        </header>
        </>

    );

}

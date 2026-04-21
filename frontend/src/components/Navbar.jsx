import React, { useEffect, useRef } from "react";
import "./Navbar.css";
import gsap from "gsap";
import { useContext } from "react";
import { ThemeContext } from "./Context";
const Navbar = ({ isOpen }) => {

   const { theme , toggleTheme } = useContext(ThemeContext);

  const logoRef = useRef();

  useEffect(() => {
    gsap.fromTo(
      logoRef.current,
      {
        y: -20,
        opacity: 0,
      },
      {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: "power2.out",
      }
    );
  }, []);

  return (
    <nav className={`navbar ${theme}`}>
      <div className="navbar-logo" ref={logoRef}>
        <h2 className={isOpen ? "logo-hide" : ""}>Blogi</h2>

        <i title={theme === "light" ? "Enable DarkMode" : "Enable LightMode"} onClick={toggleTheme} className={theme === "light" ? "fa-solid fa-moon" : "fa-solid fa-sun"}></i>
      </div>
    </nav>
  );
};

export default Navbar;
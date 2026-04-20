import React, { useEffect } from "react";
import "./Navbar.css";
import gsap from "gsap";

const Navbar = ({ isOpen }) => {
  useEffect(() => {
    gsap.fromTo(
      ".animate-logo",
      {
        y: -20,
        opacity: 0,
      },
      {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: "power2.out",
      },
    );
  }, []);

  return (
    <nav className={`navbar`}>
      <div className="navbar-logo animate-logo">
        <h2 className={isOpen ? "logo-hide" : ""}>Blogi</h2>
       
      </div>
    </nav>
  );
};

export default Navbar;

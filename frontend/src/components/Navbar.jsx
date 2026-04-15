import React, { useEffect } from "react";
import "./Navbar.css";
import gsap from "gsap";

import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/clerk-react";

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
      }
    );
  }, []);

  return (
    <nav className="navbar">
      
      <div className="navbar-logo animate-logo">
        <h2 className={isOpen ? "logo-hide" : ""}>Blogi</h2>
      </div>

      <div className="navbar-auth">
        <SignedOut>
          <SignInButton mode="modal" />
          <SignUpButton mode="modal" />
        </SignedOut>

        <SignedIn>
          <UserButton afterSignOutUrl="/" />
        </SignedIn>
      </div>

    </nav>
  );
};

export default Navbar;
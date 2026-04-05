import React from 'react'
import "./Navbar.css"
import image from "../assets/image.png"
const Navbar = () => {
  return (
    <div>
      <nav className="navbar">
        <div className="navbar-logo">
          <img src={image} alt="This is brand Logo" />
          <h2>Blogi</h2>
        </div>
      </nav>
    </div>
  )
}

export default Navbar


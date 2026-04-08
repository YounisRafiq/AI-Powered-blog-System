import React from 'react'
import "./Navbar.css"
const Navbar = ({isOpen}) => {
  return (
    <div>
      <nav className="navbar">
        <div className="navbar-logo">
          <h2 className={isOpen ? "logo-hide" : ""}>Blogi</h2>
        </div>
      </nav>
    </div>
  )
}

export default Navbar


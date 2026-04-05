import React from 'react'
import "./Sidebar.css"
import logo from "../assets/image.png"

const Sidebar = ({ isOpen, setIsOpen }) => {
  return (
    <div className={isOpen ? "sidebar" : "sidebar sidebar-closed"}>
      
      <div className="sidebar-logo">
        
        <img src={logo} onClick={() => setIsOpen(true)} />

        <i 
          className="fa-solid fa-xmark" style={{opacity: isOpen ? 1 : 0}}
          onClick={() => setIsOpen(false)}
        ></i>

      </div>

    </div>
  );
};

export default Sidebar
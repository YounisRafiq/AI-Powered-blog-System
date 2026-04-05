import React from 'react'
import "./Sidebar.css"
import logo from '../assets/image.png'
const Sidebar = () => {
  return (
    <div>
      <div className="sidebar">
         <div className="sidebar-logo">
          <img src={logo} alt="This is logo" />
         </div>
      </div>
    </div>
  )
}

export default Sidebar


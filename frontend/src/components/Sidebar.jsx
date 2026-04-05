import React from "react";
import "./Sidebar.css";
import logo from "../assets/image.png";

const Sidebar = ({ isOpen, setIsOpen }) => {
  return (
    <div className={isOpen ? "sidebar" : "sidebar sidebar-closed"}>
      <div className="sidebar-logo">
        <img src={logo} onClick={() => setIsOpen(true)} />

        <i
          className="fa-solid fa-xmark"
          style={{ opacity: isOpen ? 1 : 0 }}
          onClick={() => setIsOpen(false)}
        ></i>
      </div>

     <div className="new-chat">
      <i  class="fa-regular fa-pen-to-square"></i>

      {  isOpen && <span>New chat</span> }
     </div>
      

      { isOpen && (
        <div className="your-chats">
      <span>Your chats</span>
      <i class="fa-solid fa-angle-down"></i>
     </div>
      ) }
     
    { isOpen && (
     <div className="chat-list">
        <span>Chat 1</span>
        <span>Chat 1</span>
        <span>Chat 1</span>
        <span>Chat 1</span>
        <span>Chat 1</span>
        <span>Chat 1</span>
        <span>Chat 1</span>
        <span>Chat 1</span>
        <span>Chat 1</span>
        <span>Chat 1</span>
        <span>Chat 1</span>
        <span>Chat 1</span>
        <span>Chat 1</span>
        <span>Chat 1</span>
        <span>Chat 1</span>
        <span>Chat 1</span>
        <span>Chat 1</span>
        <span>Chat 1</span>
        <span>Chat 1</span>
        <span>Chat 1</span>
        <span>Chat 1</span>
        <span>Chat 1</span>
        <span>Chat 1</span>
        <span>Chat 1</span>
      </div>
      )}

    </div>
  );
};

export default Sidebar;

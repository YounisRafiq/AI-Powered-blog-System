import React, { useState } from "react";
import "./Sidebar.css";
import logo from "../assets/image.png";
import Image from "../assets/my-image.jpg";

const Sidebar = ({ isOpen, setIsOpen }) => {

  const [showChat, setShowChat] = useState(true);


  return (
    <div
      style={{ overflow: !isOpen ? "hidden" : "scroll" }}
      className={isOpen ? "sidebar" : "sidebar sidebar-closed"}
    >
      <div className="sidebar-logo">
        <img src={logo} onClick={() => setIsOpen(true)} title="open sidebar" />

        <i
          title="close sidebar"
          className="fa-solid fa-xmark"
          style={{ opacity: isOpen ? 1 : 0 }}
          onClick={() => setIsOpen(false)}
        ></i>
      </div>

      <div className="new-chat">
        <i title="new chat" className="fa-regular fa-pen-to-square"></i>

        {isOpen && <span>New chat</span>}
      </div>

      {isOpen && (
        <div  className="your-chats">
          <span onClick={() => setShowChat(!showChat)}>
            Your chats{" "}
            <i
              className={`fa-solid ${
                showChat ? "fa-angle-down" : "fa-angle-right"
              }`}
            ></i>
          </span>
        </div>
      )}

      {isOpen && showChat && (
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

      <div className="profile" style={{ width: !isOpen ? "50px" : "250px" }}>
        <img src={Image} alt="This is profile image" />
        {isOpen && <h3>Younis Ali</h3>}
      </div>
    </div>
  );
};

export default Sidebar;

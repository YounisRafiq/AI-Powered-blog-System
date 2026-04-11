import React, { useState, useEffect } from "react";
import "./Sidebar.css";
import logo from "../assets/image.png";
import axios from "axios";
import { Link } from "react-router-dom"
const Sidebar = ({ isOpen, setIsOpen }) => {


  const [showChat, setShowChat] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/user/me", {
          withCredentials: true,
        });

        setUser(res.data.user);
      } catch (error) {
        console.log(error.message);
      }
    };

    fetchData();
  }, []);

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
        <div className="your-chats">
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
        {user?.image ? (
          <img src={user.image} alt="profile" />
        ) : (
          <Link to="/user/login">
            <i className="fa-regular fa-circle-user"></i>
          </Link>
        )}
         <div className="name">
                  {isOpen && <h3 className="profileName">{user?.name}</h3>}

         </div>
      </div>
    </div>
  );
};

export default Sidebar;

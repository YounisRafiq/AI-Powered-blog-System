import React, { useState, useEffect } from "react";
import "./Sidebar.css";
import logo from "../assets/image.png";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const Sidebar = ({ isOpen, setIsOpen }) => {
  const naviage = useNavigate();

  const [showChat, setShowChat] = useState(true);
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/user/profile", {
          withCredentials: true,
        });

        setUser(res.data.user);
        setIsLoggedIn(true);
      } catch (error) {
        setIsLoggedIn(false);
        console.log(error.message);
      }
    };

    fetchData();
  }, []);

  const handleLogout = async () => {
    try {
      await axios.get("http://localhost:3000/api/v1/auth/user/logout", {
        withCredentials: true,
      });

      const result = confirm("Are you sure you want to loggedout?");
      if (result) {
        setIsLoggedIn(false);
        setUser(null);
        naviage("/");
      } else {
      }
    } catch (error) {
      console.log(error);
    }
  };

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

      {
  isOpen
    && showChat
      && isLoggedIn
        && (
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
          </div>
        )
}

      <div className="profile" style={{ width: !isOpen ? "50px" : "250px" }}>
        {user?.image ? (
          <Link to={"/profile"}><img src={user.image} title={user.name} alt="profile" /></Link>
        ) : (
          <Link to="/user/login">
            <i className="fa-regular fa-circle-user"></i>
          </Link>
        )}
        <div className="name">
          {isOpen && (
            <h3 className="profileName">
              {isLoggedIn ? <Link className="user-name" to={"/profile"}>{user?.name}</Link> : <Link style={{color : "whitesmoke", fontSize : "17px" ,  marginBottom : "5px" , display : "inline-block"}} to={"/user/login"}>Login</Link>}
            </h3>
          )}

          {isLoggedIn && isOpen && (
            <span
              className="logout"
              onClick={handleLogout}
              style={{ cursor: "pointer" }}
            >
              Logout
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;

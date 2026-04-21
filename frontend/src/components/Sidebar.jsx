import React, { useState, useEffect, useRef } from "react";
import "./Sidebar.css";
import logo from "../assets/image.png";
import logo2 from "../assets/logo2.png";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import gsap from "gsap";

import { useContext } from "react";
import { ThemeContext } from "./Context";

const Sidebar = ({ isOpen, setIsOpen, setCurrentChatId }) => {

  const { theme } = useContext(ThemeContext);

  const imgRef = useRef([]);
  const hasAnimated = useRef(false);
  const navigate = useNavigate();

  const [showChat, setShowChat] = useState(true);
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [chats, setChats] = useState([]);

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
      const result = await Swal.fire({
        title: "Logout!",
        text: "Are you sure you want to logout?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, Logout",
        cancelButtonText: "Cancel",
      });

      if (result.isConfirmed) {
        await axios.get("http://localhost:3000/api/v1/auth/user/logout", {
          withCredentials: true,
        });

        setIsLoggedIn(false);
        setUser(null);

        await Swal.fire({
          title: "Logged Out!",
          text: "You have been logged out successfully.",
          icon: "success",
          timer: 3000,
          showConfirmButton: false,
        });

        navigate("/");
      }
    } catch (error) {
      console.log(error);

      Swal.fire({
        title: "Error!",
        text: "Logout failed",
        icon: "error",
      });
    }
  };

  useEffect(() => {
    if (hasAnimated.current) return;

    hasAnimated.current = true;

    gsap.fromTo(
      imgRef.current,
      {
        x: -50,
        opacity: 0,
      },
      {
        x: 0,
        opacity: 1,
        duration: 0.5,
        ease: "power2.out",
        stagger: 0.1,
      },
    );
  }, []);

  const fetchAllChats = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/api/v1/blog/chats",
        { withCredentials: true },
      );

      console.log(response.data);
      setChats(response.data.chats);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetchAllChats();
    }
  }, [isLoggedIn]);

  useEffect(() => {
    const handler = () => {
      fetchAllChats();
    };

    window.addEventListener("refreshChats", handler);

    return () => window.removeEventListener("refreshChats", handler);
  }, []);

  const handleNewChat = async () => {
    try {
      const res = await axios.post(
        "http://localhost:3000/api/v1/blog/new-chat",
        {},
        { withCredentials: true },
      );

      console.log("NEW CHAT RESPONSE:", res.data);

      const chatId = res.data?.chat?._id;

      if (!chatId) return;

      window.dispatchEvent(new Event("clearMessages"));

      setCurrentChatId(chatId);

      window.dispatchEvent(new Event("refreshChats"));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div
      style={{ overflow: !isOpen ? "hidden" : "scroll" }}
      className={isOpen ? "sidebar" : "sidebar sidebar-closed"}
    >
      <div
        ref={(el) => (imgRef.current[0] = el)}
        className="animate-item sidebar-logo"
      >
        <img src={theme === "light" ? logo2 : logo} onClick={() => setIsOpen(true)} title="open sidebar" />

        <i
          title="close sidebar"
          className="fa-solid fa-xmark"
          style={{ opacity: isOpen ? 1 : 0 }}
          onClick={() => setIsOpen(false)}
        ></i>
      </div>

      <div
        ref={(el) => (imgRef.current[1] = el)}
        className="animate-item new-chat"
        onClick={handleNewChat}
      >
        <i title="new chat" className="fa-regular fa-pen-to-square"></i>

        {isOpen && <span>New chat</span>}
      </div>

      {isOpen && (
        <div className=" your-chats">
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
          {!isLoggedIn || chats.length === 0 ? (
            <p style={{ color: "whitesmoke", padding: "0 10px" }}>
              No chats yet. Start a new chat!
            </p>
          ) : (
            chats.map((chat) => (
              <>

              <div className="chat-list-icon">
                <span
                  onClick={() => {
                    setCurrentChatId(chat._id);
                    console.log("Selected Chat ID:", chat._id);
                  }}
                  key={chat._id}
                >
                  {chat.title?.length > 20
                    ? chat.title.slice(0, 20) + "..."
                    : chat.title}
                </span>
                
                </div>
              </>
            ))
          )}
        </div>
      )}

      <div
        ref={(el) => (imgRef.current[2] = el)}
        className=" animate-item profile"
        style={{ width: !isOpen ? "50px" : "250px" }}
      >
        {user?.image ? (
          <Link to={"/profile"}>
            <img src={user.image} title={user.name} alt="profile" />
          </Link>
        ) : (
          <Link to="/user/login">
            <i style={{color : theme === "light" ? "black" : "white"}} className="fa-regular fa-circle-user"></i>
          </Link>
        )}
        <div className="name">
          {isOpen && (
            <h3 className="profileName">
              {isLoggedIn ? (
                <Link className="user-name" to={"/profile"}>
                  {user?.name}
                </Link>
              ) : (
                <Link
                  style={{
                    color: theme === "light" ? "black" : "white",
                    fontSize: "17px",
                    marginBottom: "5px",
                    display: "inline-block",
                  }}
                  to={"/user/login"}
                >
                  Login
                </Link>
              )}
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

import React, { useState, useEffect } from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Content from "./components/Content";
import Navbar from "./components/Navbar";
import Register from "./components/Register";
import Login from "./components/Login";
import Profile from "./components/Profile";
import gif from "../src/assets/loading.gif";

function App() {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
const [currentChatId, setCurrentChatId] = useState(null);


  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="loading">
        <img src={gif} alt="this is loading bar" />
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <div className={isOpen ? "layout open" : "layout closed"}>
              <Sidebar setCurrentChatId={setCurrentChatId} isOpen={isOpen} setIsOpen={setIsOpen} />
              <div className="main-area">
                <Navbar isOpen={isOpen} />
                <Content currentChatId={currentChatId} setCurrentChatId={setCurrentChatId} isOpen={isOpen} />
              </div>
            </div>
          }
        />

        <Route path="/user/register" element={<Register />} />
        <Route path="/user/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </Router>
  );
}

export default App;

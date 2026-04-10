import React, { useState } from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Content from "./components/Content";
import Navbar from "./components/Navbar";
import Register from "./components/Register";
import Login from "./components/Login";

function App() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Router>
      <Routes>

        <Route
          path="/"
          element={
            <div className={isOpen ? "layout open" : "layout closed"}>
              <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />
              <div className="main-area">
                <Navbar isOpen={isOpen} />
                <Content isOpen={isOpen} />
              </div>
            </div>
          }
        />

        <Route path="/user/register" element={<Register />} />
        <Route path="/user/login" element={<Login />} />

      </Routes>
    </Router>
  );
}

export default App;
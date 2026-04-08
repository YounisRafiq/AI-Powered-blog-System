import React, { useState } from "react";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import "./App.css";
import Content from "./components/Content";

function App() {
  
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={isOpen ? "layout open" : "layout closed"}>
      
      <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />
      
      <div className="main-area">
        <Navbar isOpen={isOpen} />
      </div>

      <Content isOpen={isOpen}/>
    </div>
  );
}

export default App;
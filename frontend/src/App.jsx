import React, { useState } from "react";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import "./App.css";

function App() {
  
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={isOpen ? "layout open" : "layout closed"}>
      
      <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />
      
      <div className="main-area">
        <Navbar />
      </div>

    </div>
  );
}

export default App;
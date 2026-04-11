import React from "react";
import "./Content.css";

const Content = ({ isOpen }) => {
  return (
    <>
    <div className={`content ${isOpen ? "hide-content" : ""}`}>
      <h2>Where should we begin?</h2>

      <div className="inputs">
        <input type="text" placeholder="Ask anything" />
        <i className="fa-solid fa-circle-arrow-up"></i>
      </div>

    </div>
     </>
  );
};

export default Content;
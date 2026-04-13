import React, { useEffect } from "react";
import "./Content.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import gsap from "gsap";
import SplitType from "split-type";

const Content = ({ isOpen }) => {
  const navigate = useNavigate();

  const handleInputClick = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/user/profile", {
        withCredentials: true,
      });

      if (res.data.success) {
        console.log("User logged in");
      }
    } catch (error) {
      console.log(error);
      navigate("/user/login");
    }
  };

  useEffect(() => {
    gsap.fromTo(
      ".animate",
      {
        y: 20,
        opacity: 0,
      },
      {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: "power2.out",
      },
    );
  }, []);

useEffect(() => {
  let split = SplitType.create(".headline", {
    types: "words, chars",
  });

  gsap.from(split.chars, {
    duration: 0.5,
    y: -60,
    autoAlpha: 0,
    stagger: 0.05,
    ease: "power2.out",
    opacity : 0
  });
}, []);

  return (
    <div className={`content ${isOpen ? "hide-content" : ""}`}>
      <h2 className="headline">Where should we begin?</h2>

      <div className="inputs animate">
        <input
          type="text"
          placeholder="Ask anything"
          onClick={handleInputClick}
        />
        <i className="fa-solid fa-circle-arrow-up"></i>
      </div>
    </div>
  );
};

export default Content;

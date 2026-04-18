import React, { useEffect, useState, useRef } from "react";
import "./Content.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import gsap from "gsap";
import SplitType from "split-type";

const Content = ({ isOpen , currentChatId }) => {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [hasStartedChat, setHasStartedChat] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const navigate = useNavigate();
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

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
    if (!hasStartedChat) {
      let split = SplitType.create(".headline", {
        types: "words, chars",
      });

      gsap.from(split.chars, {
        duration: 0.5,
        y: -60,
        autoAlpha: 0,
        stagger: 0.05,
        ease: "power2.out",
        opacity: 0,
      });
    }
  }, [hasStartedChat]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { text: input, isUser: true };
    setMessages((prev) => [...prev, userMessage]);
    const newInput = "";
    setInput(newInput);

    if (!hasStartedChat) {
      gsap.to(".headline", {
        opacity: 0,
        y: -30,
        duration: 0.6,
        ease: "power2.out",
      });
      setHasStartedChat(true);
    }

    setLoading(true);
    setIsTyping(true);

    try {
      await axios.get("http://localhost:3000/api/user/profile", {
        withCredentials: true,
      });

      const res = await axios.post(
        "http://localhost:3000/api/v1/blog/generate",
        { prompt: input },
        { withCredentials: true },
      );

      window.dispatchEvent(new Event("refreshChats"));

      const aiMessage = {
        text:
          res.data.blog.content ||
          res.data.response ||
          "Great idea! Here's your blog post...",
        isUser: false,
      };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.log(error);
      const errorMsg = {
        text: "Sorry, something went wrong. Try again?",
        isUser: false,
      };
      setMessages((prev) => [...prev, errorMsg]);

      if (error.response?.status === 401) {
        navigate("/user/login");
      }
    } finally {
      setIsTyping(false);
      setLoading(false);
    }
  };



  useEffect(() => {
  const handler = () => {
    setMessages([]);   
    setInput("");     
    setHasStartedChat(false); 
    setIsTyping(false); 
    setLoading(false);
  };

  window.addEventListener("clearMessages", handler);

  return () => window.removeEventListener("clearMessages", handler);
}, []);

  useEffect(() => {
  if (!currentChatId) return;

  const fetchMessages = async () => {
    const res = await axios.get(
      `http://localhost:3000/api/v1/blog/chats`,
      { withCredentials: true }
    );

    const chat = res.data.chats.find(
      (c) => c.id === currentChatId
    );

    if (chat) {
      setMessages([]);
    }
  };

  fetchMessages();
}, [currentChatId]);


  return (
    <div className={`content ${isOpen ? "hide-content" : ""}`}>
      {!hasStartedChat ? (
        <>
          <h2 className="headline">Where should we begin?</h2>
          <div className="inputs animate">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything..."
              onClick={handleInputClick}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
            />
            <i
              onClick={handleSend}
              className="fa-solid fa-circle-arrow-up"
              style={{
                cursor: loading ? "not-allowed" : "pointer",
                opacity: loading ? 0.5 : 1,
              }}
            ></i>
          </div>
        </>
      ) : (
        <div className="chat-container">
          <div className="messages-container">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`message ${msg.isUser ? "user-message" : "ai-message"}`}
              >
                <div className="message-bubble">{msg.text}</div>
              </div>
            ))}
            {isTyping && (
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          <div
            className={`chat-input-container ${isOpen ? "sidebar-open" : ""}`}
          >
            <div className="inputs">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                onClick={handleInputClick}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
              />
              <i
                onClick={handleSend}
                className="fa-solid fa-circle-arrow-up"
              ></i>
            </div>

            {hasStartedChat && (
              <p className="disclaimer">
                Blogi can make mistakes! check important information
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Content;

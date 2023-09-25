// Loading.jsx
import React from "react";
import "./Loading.css";

const Loading = () => {
  return (
    <>
      <div className="loader-container">
        <div className="dots-container">
          <div className="dot1"></div>
          <div className="dot2"></div>
          <div className="dot3"></div>
        </div>

      </div>
    </>
  ); // You can customize this as needed
};

export default Loading;

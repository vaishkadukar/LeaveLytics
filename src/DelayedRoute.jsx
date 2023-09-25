import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
import Loading from "./Loading.jsx"; // Import the Loading component

const DelayedRoute = ({ component: Component, delay, ...rest }) => {
//   const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
      clearTimeout(timer);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [delay]);

  return loading ? <Loading /> : <Component {...rest} />;
};

export default DelayedRoute;
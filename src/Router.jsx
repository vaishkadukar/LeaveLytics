import React from "react";
import ReactDOM from "react-dom/client";
import UploadFile from "./UploadFile.jsx";
import App from "./App.jsx";
import LeaveDetails from "./LeaveDetails.jsx";
import DelayedRoute from "./DelayedRoute.jsx";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// ReactDOM.createRoot(document.getElementById("root")).render(
//   <BrowserRouter>
//     <Routes>
//       <Route path="/" element={<UploadFile />} />
//       <Route path="/Home" element={<App />} />
//       <Route path="/Details" element={<LeaveDetails />} />
//     </Routes>
//   </BrowserRouter>
// );


ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<UploadFile />} />
      <Route
        path="/Home"
        element={
          <DelayedRoute
            component={App}
            delay={1200} // 800 milliseconds delay
          />
        }
      />
      <Route
        path="/Details"
        element={
          <DelayedRoute
            component={LeaveDetails}
            delay={1200} // 800 milliseconds delay
          />
        }
      />
    </Routes>
  </BrowserRouter>
);

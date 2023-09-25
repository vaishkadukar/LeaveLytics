import React from "react";
import "./LeaveDetails.css";
import Table from "./LeaveDetailsTable";
import { useLocation, useNavigate } from "react-router-dom";
import backButton from "./assets/back-button.png";

const LeaveDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const receivedDate = location.state.clickedDate;

  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  function formatDate(number) {
    const suffixes = ["st", "nd", "rd"];
    const num = parseInt(number, 10);
    const suffix =
      num <= 20 ? suffixes[num - 1] || "th" : suffixes[(num % 10) - 1] || "th";

    return `${num}${suffix}`;
  }

  const options = {
    day: "2-digit",
    month: "long",
    year: "numeric",
  };

  const formattedDate = new Date(receivedDate).toLocaleDateString(
    "en-US",
    options
  );

  const todayDay = daysOfWeek[new Date(receivedDate).getDay()];
  const filteredRows = location.state.data.filter(
      (rowData) =>
        rowData[formatDate(location.state.currentdate)] === "Planned" ||
        rowData[formatDate(location.state.currentdate)] === "Unplanned"
    ).map((rowData) => {
      return {
        id: rowData.EMPLID,
        EMP_NAME: rowData.EMP_NAME,
        TYPE: rowData[formatDate(location.state.currentdate)],
        ONSITE_OFFSHORE: rowData["ONSITE_OFFSHORE"],
        EMP_CONTACT: {
          phone: rowData.PHONENO,
          mail: rowData.MAIL,
        },
        REPL: {
          name: rowData.REPLACEMENT_NAME,
          contact: rowData.REPLACEMENT_MAIL,
        },
        REPL_CONTACT: {
          rphoneno: rowData.REPLACEMENT_PHONENO,
        },
      };
    });

  const planned = filteredRows.filter((row) => row.TYPE === "Planned").length;
  const unplanned = filteredRows.filter((row) => row.TYPE === "Unplanned").length;

  return (
    <div>
      <div className="next-page-header">
        <div className="left-container">
          <img
            className="myButton"
            src={backButton}
            onClick={() => navigate(-1)}
            alt="Back"
          />

          <div className="today">
            <p className="today-day">{todayDay}</p>
            <p className="today-date">{formattedDate}</p>
          </div>
        </div>

        <div className="middle-section">
          <div className="planned">
            <p>{planned}</p>
            <p>Planned</p>
          </div>

          <div className="unplanned">
            <p>{unplanned}</p>
            <p>Unplanned</p>
          </div>
        </div>
      </div>

      <Table data={filteredRows} />
    </div>
  );
};

export default LeaveDetails;

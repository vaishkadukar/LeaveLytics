import { useEffect, useRef, useState } from "react";
import "./DashboardView.css";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import * as xlsx from "xlsx";
import { useNavigate, useLocation } from "react-router-dom";
import backButton from "./assets/back-button.png";

const DashboardView = () => {
  const [excel, setExcel] = useState([]);
  const [excelData, setExcelData] = useState([]);
  const [shouldUpdateCalendar, setShouldUpdateCalendar] = useState(true);
  const calendarRef = useRef(null);
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [dayTotals, setDayTotals] = useState({});
  const [planned, setPlanned] = useState(0);
  const [unplanned, setUnplanned] = useState(0);
  const [onsite, setOnsite] = useState(0);
  const [offshore, setOffshore] = useState(0);
  const [total, setTotal] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const { excelfile } = location.state;
    setExcel(excelfile);
    const excelsheet = excelfile.Sheets[formatMonth(new Date())];
    const exceljson = xlsx.utils.sheet_to_json(excelsheet);
    setExcelData(exceljson);
    setShouldUpdateCalendar(true);
  }, []);

  useEffect(() => {
    if (shouldUpdateCalendar && calendarRef.current) {
      const month = calendarRef.current.getApi().view.currentStart;
      updateExcelData(month);
      setShouldUpdateCalendar(false);
    }
  }, [shouldUpdateCalendar]);

  useEffect(() => {
    totalLeaves();
    plannedLeaves();
    unplannedLeaves();
    offshoreLeaves();
    onsiteLeaves();
  }, [excelData]);

  useEffect(() => {
    calculateDayTotals(excelData);
  }, [excelData]);

  useEffect(() => {
    generateEvents();
  }, [dayTotals]);

  const totalLeaves = () => {
    var total = 0;
    var plannedCount = 0;
    var unPlannedCount = 0;

    excelData.forEach((row) => {
      for (let i = 1; i <= 31; i++) {
        var cellValue;

        if (i === 1 || i === 21 || i === 31) {
          cellValue = row[i + "st"];
        } else if (i === 2 || i === 22) {
          cellValue = row[i + "nd"];
        } else if (i === 3 || i === 23) {
          cellValue = row[i + "rd"];
        } else {
          cellValue = row[i + "th"];
        }

        if (cellValue === "Planned") plannedCount++;
        else if (cellValue === "Unplanned") unPlannedCount++;
      }
    });

    total = plannedCount + unPlannedCount;
    setTotal(total);
  };

  const plannedLeaves = () => {
    var plannedCount = 0;

    excelData.forEach((row) => {
      for (let i = 1; i <= 31; i++) {
        var cellValue;
        if (i === 1 || i === 21 || i === 31) {
          cellValue = row[i + "st"];
        } else if (i === 2 || i === 22) {
          cellValue = row[i + "nd"];
        } else if (i === 3 || i === 23) {
          cellValue = row[i + "rd"];
        } else {
          cellValue = row[i + "th"];
        }

        if (cellValue === "Planned") plannedCount++;
      }
    });

    setPlanned(plannedCount);
  };

  const unplannedLeaves = () => {
    var unPlannedCount = 0;

    excelData.forEach((row) => {
      for (let i = 1; i <= 31; i++) {
        var cellValue;

        if (i === 1 || i === 21 || i === 31) {
          cellValue = row[i + "st"];
        } else if (i === 2 || i === 22) {
          cellValue = row[i + "nd"];
        } else if (i === 3 || i === 23) {
          cellValue = row[i + "rd"];
        } else {
          cellValue = row[i + "th"];
        }

        if (cellValue === "Unplanned") unPlannedCount++;
      }
    });

    setUnplanned(unPlannedCount);
  };

  const offshoreLeaves = () => {
    var offshoreCount = 0;

    excelData.forEach((row) => {
      for (let i = 1; i <= 31; i++) {
        var cellValue;
        if (i === 1 || i === 21 || i === 31) {
          cellValue = row[i + "st"];
        } else if (i === 2 || i === 22) {
          cellValue = row[i + "nd"];
        } else if (i === 3 || i === 23) {
          cellValue = row[i + "rd"];
        } else {
          cellValue = row[i + "th"];
        }

        if (cellValue === "Planned" || cellValue === "Unplanned") {
          if (row["ONSITE_OFFSHORE"] === "OFFSHORE") offshoreCount++;
          break;
        }
      }
    });

    setOffshore(offshoreCount);
  };

  const onsiteLeaves = () => {
    var onsiteCount = 0;

    excelData.forEach((row) => {
      for (let i = 1; i <= 31; i++) {
        var cellValue;
        if (i === 1 || i === 21 || i === 31) {
          cellValue = row[i + "st"];
        } else if (i === 2 || i === 22) {
          cellValue = row[i + "nd"];
        } else if (i === 3 || i === 23) {
          cellValue = row[i + "rd"];
        } else {
          cellValue = row[i + "th"];
        }

        if (cellValue === "Planned" || cellValue === "Unplanned") {
          if (row["ONSITE_OFFSHORE"] === "ONSITE") onsiteCount++;
          break;
        }
      }
    });

    setOnsite(onsiteCount);
  };

  const updateExcelData = async (month) => {
    const monthYearFormatter = new Intl.DateTimeFormat("en", {
      year: "numeric",
      month: "long",
    });

    const formattedMonth = monthYearFormatter.format(month);
    const sheetName = formattedMonth;
    const sheetExists = excel.SheetNames?.includes(sheetName);

    if (excel && sheetExists) {
      const excelsheet = excel.Sheets[sheetName];
      const exceljson = xlsx.utils.sheet_to_json(excelsheet);
      setExcelData(exceljson);
    } else {
      setTotal(0);
      setPlanned(0);
      setUnplanned(0);
      setOnsite(0);
      setOffshore(0);
    }
  };

  const formatMonth = (date) => {
    const monthYearFormatter = new Intl.DateTimeFormat("en", {
      year: "numeric",
      month: "long",
    });

    return monthYearFormatter.format(date);
  };

  const calculateDayTotals = (data) => {
    const totals = {};

    for (let i = 1; i <= 31; i++) {
      let plannedTotal = 0;
      let unplannedTotal = 0;

      data.forEach((row) => {
        var value;
        if (i === 1 || i === 21 || i === 31) {
          value = row[i + "st"];
        } else if (i === 2 || i === 22) {
          value = row[i + "nd"];
        } else if (i === 3 || i === 23) {
          value = row[i + "rd"];
        } else {
          value = row[i + "th"];
        }

        if (value === "Planned") {
          plannedTotal++;
        } else if (value === "Unplanned") {
          unplannedTotal++;
        }
      });

      if (plannedTotal > 0 || unplannedTotal > 0) {
        totals[i] = { planned: plannedTotal, unplanned: unplannedTotal };
      }
    }

    setDayTotals(totals);
  };

  const generateEvents = () => {
    const events = [];

    for (const day in dayTotals) {
      const eventDate = new Date(selectedMonth);
      eventDate.setDate(day);
      const { planned, unplanned } = dayTotals[day];
      const totalLeavesToday = planned + unplanned;

      events.push({
        title: `${totalLeavesToday}`,
        start: eventDate,
        allDay: true,
      });
    }

    if (calendarRef.current) {
      calendarRef.current.getApi().removeAllEvents();
      calendarRef.current.getApi().addEventSource(events); 
    }
  };

  const handleMonthChange = (currMonthYear) => {
    setSelectedMonth(currMonthYear);
  };

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const handleDateClick = (arg) => {
    const clickedEvent = arg.event;
    const year = clickedEvent.start.getFullYear();
    const month = monthNames[clickedEvent.start.getMonth()];
    const day = String(clickedEvent.start.getDate()).padStart(2, "0");
    const clickedDate = year + "-" + month + "-" + day;
    const clickedInfo = clickedEvent.title;

    const detailsObj = {
      clickedDate: clickedDate,
      currentdate: day,
      data: excelData,
      clickedMonthYear: `${month} ${year}`,
    };

    if (clickedInfo != 0) {
      navigate("/Details", { state: detailsObj });
    }
  };

  return (
    <>
      <div className="container">
        <img
          className="backButton"
          src={backButton}
          onClick={() => navigate(-1)}
          alt="Back"
        />

        <main className="main-container">
          <div className="main-cards">
            <div className="total-card card">
              <h1>{total}</h1>
              <div className="card-inner">
                <h3>MANDAYS LEAVE</h3>
              </div>
            </div>

            <div className="card-group">
              <div className="card">
                <h1>{onsite}</h1>
                <div className="card-inner">
                  <h3>ONSITE</h3>
                </div>
              </div>

              <div className="card">
                <h1>{offshore}</h1>
                <div className="card-inner">
                  <h3>OFFSHORE</h3>
                </div>
              </div>
            </div>

            <div className="card-group">
              <div className="card">
                <h1>{planned}</h1>
                <div className="card-inner">
                  <h3>PLANNED</h3>
                </div>
              </div>

              <div className="card">
                <h1>{unplanned}</h1>
                <div className="card-inner">
                  <h3>UNPLANNED</h3>
                </div>
              </div>
            </div>
          </div>
        </main>

        <div className="calendar">
          <FullCalendar
            ref={calendarRef}
            plugins={[dayGridPlugin]}
            initialView="dayGridMonth"
            events={[]}
            eventClick={handleDateClick}
            datesSet={(info) => {
              const thisMonth = info.view.currentStart;
              updateExcelData(thisMonth);
              setShouldUpdateCalendar(true);
              setSelectedMonth(thisMonth);
            }}
          />
        </div>
      </div>
    </>
  );
};

export default DashboardView;

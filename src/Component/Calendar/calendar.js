import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import React, { useState, useEffect } from "react";
import Datetime from "react-datetime";
import styles from "./calendar.module.css";

function FullCalendarApp(props) {
  const [visible, setVisible] = useState(false);
  const [title, setTitle] = useState("");
  const [start, setStart] = useState(new Date());
  const [end, setEnd] = useState(new Date());
  const [eventsData, setEventsData] = useState([]);
  const [edit, setEdit] = useState(false);
  const [eventId, setEventId] = useState(-1);
  const [reload, setReload] = useState(false);

  let calendarRef = React.createRef();

  useEffect(() => {
    var uId = props.userId;
    if (!uId) {
      uId = localStorage.getItem("userId");
    }
    fetch(`https://calendar-app-backend-fedx.onrender.com/events/${uId}`)
      .then((res) => res.json())
      .then((result) => {
        setEventsData(result);
      });
  }, [props.userId, reload]);

  /* Handle Logout Event */
  const handleLogout = () => {
    props.setUserId("");
    props.setIsLogedIn(false);
    setEventsData([]);
    setEdit(false);
    setEventId(-1);
    localStorage.removeItem("userId");
    localStorage.removeItem("loginStatus");
  };

  /* Handle calander view */
  const handleDateClick = (e) => {
    calendarRef.current.getApi().changeView("timeGridDay", e.date);
  };

  /* Handle Add Event */
  const handleAddNew = (e) => {
    setTitle("");
    setEventId(-1);
    setStart(new Date());
    setEnd(new Date());
    setVisible(visible ? false : true);
  };

  /* Handle Edit Event */
  const handleEdit = (e) => {
    handleAddNew();
    setEdit(true);
    var index = -1;
    for (var i = 0; i < eventsData.length; i++) {
      if (parseInt(eventsData[i].id) === parseInt(e.event.id)) {
        index = i;
      }
    }
    if (index >= 0) {
      setEventId(e.event.id);
      setTitle(eventsData[index].title);
      setStart(new Date(eventsData[index].start));
      setEnd(new Date(eventsData[index].end));
    } else {
      alert("Sorry! Event Not Found!!");
    }
  };

  /* Add and Edit Events */
  const onSubmit = async (e) => {
    e.preventDefault();
    if (edit) {
      const eventUpdated = {
        id: eventId,
        title: title,
        start: start.toISOString(),
        end: end.toISOString(),
      };
      const requestOptions = {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(eventUpdated),
      };
      await fetch(
        "https://calendar-app-backend-fedx.onrender.com/event/update",
        requestOptions
      )
        .then((response) => response.json())
        .then((data) => console.log("Put", data));
      setEdit(false);
    } else {
      const eventNew = {
        userId: props.userId,
        title: title,
        start: start.toISOString(),
        end: end.toISOString(),
        id: new Date().getTime(),
      };
      await fetch("https://calendar-app-backend-fedx.onrender.com/event/add", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(eventNew),
      });
    }

    handleAddNew();
    setReload(reload ? false : true);
  };

  return (
    <div className={styles.app}>
      {/* Calendar Part*/}
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          center: "dayGridMonth,timeGridWeek,timeGridDay new logout",
        }}
        customButtons={{
          new: {
            text: "Add New Event",
            click: handleAddNew,
          },
          logout: {
            text: "Logout",
            click: handleLogout,
          },
        }}
        events={eventsData}
        eventColor="red"
        nowIndicator
        dateClick={handleDateClick}
        eventClick={handleEdit}
        ref={calendarRef}
      />
      {/* Add and Edit Event Form*/}
      <div
        className={styles.getEventDetails}
        style={{ display: visible ? "unset" : "none" }}
      >
        <button onClick={handleAddNew}>{"< "}Cancel</button>
        <h2>Add New Event</h2>
        <form onSubmit={onSubmit}>
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <div className={styles.dateTime}>
            <div>
              <label>Start Date</label>
              <Datetime value={start} onChange={(date) => setStart(date)} />
            </div>
            <div>
              <label>End Date</label>
              <Datetime value={end} onChange={(date) => setEnd(date)} />
            </div>
          </div>
          <button>{eventId !== -1 ? "Update Event" : "Add Event"}</button>
        </form>
      </div>
    </div>
  );
}

export default FullCalendarApp;

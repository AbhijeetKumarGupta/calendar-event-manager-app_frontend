import "./App.css";
import FullCalendarApp from "./Component/Calendar/calendar";
import Login from "./Component/Login/login";
import { useState } from "react";
import Topbar from "./Component/Topbar/topbar";

function App() {
  const [isLogedin, setIsLogedIn] = useState(false);
  const [userId, setUserId] = useState("");
  return (
    <div className="App">
      <Topbar />
      {!isLogedin && (
        <Login
          setIsLogedIn={(e) => setIsLogedIn(e)}
          setUserId={(e) => setUserId(e)}
        />
      )}
      {isLogedin && (
        <FullCalendarApp
          setIsLogedIn={(e) => setIsLogedIn(e)}
          setUserId={(e) => setUserId(e)}
          userId={userId}
        />
      )}
    </div>
  );
}

export default App;

import { useState, useEffect } from "react";
import styles from "./login.module.css";

function Login(props) {
  /* Login States */
  const [userName, setUserName] = useState("");
  const [userPassword, setUserPassword] = useState("");
  /* Signup States */
  const [userNameS, setUserNameS] = useState("");
  const [userPasswordS, setUserPasswordS] = useState("");
  const [userRePasswordS, setUserRePasswordS] = useState("");

  const [load, setLoad] = useState(false);

  useEffect(() => {
    const loginStatus = localStorage.getItem("loginStatus");
    if (loginStatus && loginStatus === "true") {
      const userId = localStorage.getItem("userId");
      props.setUserId(userId);
      props.setIsLogedIn("true");
    } else {
      setLoad(true);
    }
  }, []);

  /* Handle Login Event */
  const onSubmitLogin = async (e) => {
    if (!userName || !userPassword) {
      e.preventDefault();
      alert("Fields cannot be empty!!");
      return;
    }
    e.preventDefault();
    await fetch("https://calendar-app-backend-fedx.onrender.com/login", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userName: userName,
        password: userPassword,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        if (result.login === "Success") {
          props.setUserId(result.userId);
          props.setIsLogedIn(true);
          localStorage.setItem("userId", result.userId);
          localStorage.setItem("loginStatus", true);
        } else if (result.login === "Failed") {
          alert(
            "Login Failed, Make sure you are entering right id and password!"
          );
        }
      });
  };

  /* Handle Signup Event */
  const onSubmitSignup = async (e) => {
    e.preventDefault();
    if (!userNameS || !userPasswordS || !userRePasswordS) {
      alert("Fields cannot be empty!!");
      return;
    }
    await fetch("https://calendar-app-backend-fedx.onrender.com/user/add", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: new Date().getTime(),
        userName: userNameS,
        password: userPasswordS,
        rePassword: userRePasswordS,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
        if (result.signup === "Success") {
          alert("User Added Successfully, You can login now!!");
          window.location.assign("/");
        } else {
          alert(result.error);
        }
      });
  };

  return (
    load && (
      <div className={styles.mainDiv}>
        <div className={styles.bottom}>
          <div className={styles.leftDiv}>
            <h1>Already have an account!</h1>
            <form onSubmit={onSubmitLogin}>
              <label>Login</label>
              <div>
                <br />
                <label>User Name:</label>
                <br />
                <input
                  type="text"
                  placeholder="User Name"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                />
                <br />
                <br />
                <label>Password:</label>
                <br />
                <input
                  type="password"
                  placeholder="Password"
                  value={userPassword}
                  onChange={(e) => setUserPassword(e.target.value)}
                />
                <br />
                <br />
                <button>Login</button>
              </div>
            </form>
          </div>
          <div className={styles.rightDiv}>
            <h1>Don't have an account yet!</h1>
            <form onSubmit={onSubmitSignup}>
              <label>SignUp</label>
              <div>
                <br />
                <label>User Name:</label>
                <br />
                <input
                  type="text"
                  placeholder="User Name"
                  value={userNameS}
                  onChange={(e) => setUserNameS(e.target.value)}
                />
                <br />
                <br />
                <label>Password:</label>
                <br />
                <input
                  type="password"
                  placeholder="Password"
                  value={userPasswordS}
                  onChange={(e) => setUserPasswordS(e.target.value)}
                />
                <br />
                <br />
                <label>Re-Enter Password:</label>
                <br />
                <input
                  type="password"
                  placeholder="Password"
                  value={userRePasswordS}
                  onChange={(e) => setUserRePasswordS(e.target.value)}
                />
                <br />
                <br />
                <button>Signup</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    )
  );
}

export default Login;

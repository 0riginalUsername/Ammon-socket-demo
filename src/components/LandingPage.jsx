import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
export default function LandingPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [usernameValue, setUsernameValue] = useState("");
  const [passwordValue, setPasswordValue] = useState("");
  const [regState, setRegState] = useState(true);

  function setUsername(username) {
    dispatch({ type: "getUsername", payload: username });
  }

  function setUserId(userId) {
    dispatch({ type: "getUserId", payload: userId });
  }

  const onLogin = async (e, formData) => {
    e.preventDefault();
    console.log(formData);
    let res = await axios.post("http://localhost:5555/api/auth", formData);
    console.log("userID is:", res.data.userId);
    setUserId(res.data.userId);
    if (res.data.success) {
      console.log("login success");
      console.log(formData.username);
      setUsername(formData.username);
      navigate("/home");
    } else {
      alert("Login failed!");
    }
  };

  const toggleReg = () => {
    setRegState(!regState);
  };

  const onReg = async (e, formData) => {
    e.preventDefault();

    console.log("registered.");
    const res = await axios.post(`http://localhost:5555/api/newuser`, formData);

    if (!res.data.success) {
      alert("Username is taken!");
    } else {
      alert("Account created");
      toggleReg();
    }
  };

  if (regState === true) {
      return (
        <>
          <div className="cred">ENTER YOUR CREDENTIALS</div>
          <div className="box">
          <form
            className="bottom"
            onSubmit={(e) => {
              e.preventDefault();
              onLogin(e, {
                username: usernameValue,
                password: passwordValue,
              });
            }}
            >
            <label htmlFor="username">USERNAME</label>
            <input
              className="user-input"
              name="username"
              id="username"
              type="text"
              required
              maxLength={15} // Limit username to 20 characters
              onChange={(e) => setUsernameValue(e.target.value.toUpperCase())}
              value={usernameValue}
            />
            <label htmlFor="password">PASSWORD</label>
            <input
              className="user-input"
              name="password"
              id="password"
              type="password"
              required
              maxLength={15}
              onChange={(e) => setPasswordValue(e.target.value)}
            />
            <button className="btn" type="submit">
              LOG IN
            </button>
            <button className="btn" onClick={toggleReg}>
              REGISTER
            </button>
          </form>
          </div>
        </>
      );
    } else {
      return (
        <>
        <div className="cred">CREATE NEW ACCOUNT</div>
        <div className="box">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              onReg(e, {
                username: usernameValue,
                password: passwordValue,
              });
            }}
          >
            <label className="bottom" htmlFor="username">
              USERNAME
            </label>
            <input
              className="user-input"
              name="username"
              id="username"
              type="text"
              required
              maxLength={15} // Limit username to 20 characters
              onChange={(e) => setUsernameValue(e.target.value.toUpperCase())}
              value={usernameValue}
            />
            <label className="bottom" htmlFor="password">
              PASSWORD
            </label>
            <input
              className="user-input"
              name="password"
              id="password"
              type="password"
              required
              maxLength={15} // Limit username to 20 characters
              onChange={(e) => setPasswordValue(e.target.value)}
            />
            <button className="btn" type="submit">
              REGISTER
            </button>
            <button className="btn" onClick={toggleReg}>
              LOGIN
            </button>
          </form>
        </div>
        </>
      );
    }
    }


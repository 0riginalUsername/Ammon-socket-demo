import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import {useDispatch} from 'react-redux'
export default function LandingPage() {
    const navigate = useNavigate();
    const dispatch = useDispatch()
    const [usernameValue, setUsernameValue] = useState("");
    const [passwordValue, setPasswordValue] = useState("");
    const [regState, setRegState] = useState(true);
    
    function setUsername(username){

        dispatch({type: 'getUsername', payload: username })
    }


  const onLogin = async (e, formData) => {
    e.preventDefault();
    console.log(formData);
    let res = await axios.post("http://localhost:5555/api/auth", formData);

    if (res.data.success) {
        console.log("login success");
        console.log(formData.username);
        setUsername(formData.username)
        navigate("/home");
        
    } else {
      alert("Login failed!");
    }
  };

  const login = () => {
    navigate("/login");
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
        alert('Account created')
        toggleReg()
    }
  };

  if (regState === true) {
    return (
      <>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onLogin(e, {
              username: usernameValue,
              password: passwordValue,
            });
          }}
        >
          <label htmlFor="username">Username</label>
          <input
            name="username"
            id="username"
            type="text"
            required
            onChange={(e) => setUsernameValue(e.target.value)}
          />
          <label htmlFor="password">Password</label>
          <input
            name="password"
            id="password"
            type="text"
            required
            onChange={(e) => setPasswordValue(e.target.value)}
          />
          <button type="submit">Log in</button>
        </form>
        <button onClick={toggleReg}>Register</button>
      </>
    );
  } else {
    return (
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onReg(e, {
            username: usernameValue,
            password: passwordValue,
          });
        }}
      >
        <label htmlFor="username">Username</label>
        <input
          name="username"
          id="username"
          type="text"
          required
          onChange={(e) => setUsernameValue(e.target.value)}
        />
        <label htmlFor="password">Password</label>
        <input
          name="password"
          id="password"
          type="text"
          required
          onChange={(e) => setPasswordValue(e.target.value)}
        />
        <button type="submit">
          Register
        </button>
      </form>
    );
  }
}

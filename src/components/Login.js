import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [emailWarning, setEmailWarning] = useState(false);
  let history = useNavigate();
  const login = () => {
    if (email) {
      localStorage.setItem("email", email);
      history("chat");
    } else if (!email) {
      setEmailWarning(true);
    }
  };
  const updateEmail = (e) => {
    setEmail(e);
    setEmailWarning(false);
  };
  return (
    <div className="container">
      <main className="main">
        <h1 className="title">Welcome</h1>
        <section className="loginSection">
          <input
            type="email"
            onChange={(e) => updateEmail(e.target.value)}
            placeholder="Email"
          />
          {emailWarning && (
            <span className="warning">You need to enter you email.</span>
          )}
          <button onClick={login}>Continue</button>
        </section>
      </main>
    </div>
  );
}

export default Login;

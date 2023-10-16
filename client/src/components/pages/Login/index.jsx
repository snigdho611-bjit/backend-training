import { useEffect, useState } from "react";
import "./index.scss";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [response, setResponse] = useState({
    message: "",
    loading: false,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setResponse((prevState) => ({ ...prevState, loading: true }));
    if (email === "") {
      return setResponse({
        message: "Recipient email was not provided",
        loading: false,
      });
    }
    fetch(`${import.meta.env.VITE_BACKEND}/auth/login`, {
      method: "POST",
      body: JSON.stringify({ email: email, password: password }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((json) => {
        if (json.success) {
          setResponse({ message: json.message });
        } else {
          setResponse({ message: json.message });
        }
        setResponse((prevState) => ({ ...prevState, loading: false }));
      })
      .catch((err) => {
        console.log(err);
        setResponse({ message: err.message, loading: false });
      });
  };

  return (
    <form className="login">
      <label htmlFor="" className="login_label">
        Email:
      </label>
      <input
        type="text"
        name=""
        id=""
        className="login_input"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <label htmlFor="" className="login_label">
        Password:
      </label>
      <input
        type="password"
        className="login_input"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button
        type="submit"
        className="login_button"
        onClick={handleSubmit}
        disabled={response.loading}
      >
        {response.loading ? "Loading..." : "Confirm"}
      </button>
      <div className="login_message">{response.message}</div>
      <a className="login_forgot" href="/forgot-password">
        Forgot Password?
      </a>
    </form>
  );
};

export default Login;

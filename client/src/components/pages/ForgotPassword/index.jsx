import { useEffect, useState } from "react";
import "./index.scss";

const ForgetPassword = () => {
  const [email, setEmail] = useState("");
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
    fetch(`${import.meta.env.VITE_BACKEND}/auth/forgot-password`, {
      method: "POST",
      body: JSON.stringify({ recipient: email }),
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
    <form className="forgotpassword">
      <label htmlFor="" className="forgotpassword_label">
        Email:
      </label>
      <input
        type="text"
        className="forgotpassword_input"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <button
        type="submit"
        className="forgotpassword_button"
        onClick={handleSubmit}
        disabled={response.loading}
      >
        {response.loading ? "Loading..." : "Confirm"}
      </button>
      <div className="forgotpassword_message">{response.message}</div>
      <a className="forgotpassword_login" href="/login">
        Back to Login
      </a>
    </form>
  );
};

export default ForgetPassword;

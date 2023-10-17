import React, { useEffect, useState } from "react";
import "./index.scss";
import { useParams } from "react-router-dom";

const ResetPassword = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    // const [valid, setValid] = useState(false);

    const [response, setResponse] = useState({
        message: "",
        loading: false,
    });

    const { token, userId } = useParams();

    useEffect(() => {
        // fetch(`${import.meta.env.VITE_BACKEND}/auth/validate-password-reset-request`, {
        //     method: "POST",
        //     body: JSON.stringify({ token: token, userId: userId }),
        //     headers: {
        //         "Content-Type": "application/json",
        //     },
        // })
        //     .then((response) => response.json())
        //     .then((json) => {
        //         if (json.success) {
        //             setValid(true);
        //         } else {
        //             setValid(false);
        //             setResponse((prevState) => ({
        //                 ...prevState,
        //                 message: "Request is no longer valid",
        //             }));
        //         }
        //     });
    }, [token, userId]);

    const handleSubmit = (e) => {
        e.preventDefault();
        setResponse((prevState) => ({ ...prevState, loading: true }));
        if (password === "" || confirmPassword === "") {
            return setResponse({
                message: "One of the fields is empty",
                loading: false,
            });
        }

        if (password !== confirmPassword) {
            return setResponse({
                message: "Password fields do not match",
                loading: false,
            });
        }
        fetch(`${import.meta.env.VITE_BACKEND}/auth/reset-password`, {
            method: "POST",
            body: JSON.stringify({
                token: token,
                userId: userId,
                newPassword: password,
                confirmPassword: confirmPassword,
            }),
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((response) => response.json())
            .then((json) => {
                if (json.success) {
                    setResponse({ message: json.message });
                }
                setResponse({ message: json.message });
                setResponse((prevState) => ({ ...prevState, loading: false }));
            })
            .catch((err) => {
                console.log(err);
                setResponse({ message: err.message, loading: false });
            });
    };
    return (
        <form className="resetpassword">
            <label htmlFor="" className="resetpassword_label">
                New Password:
            </label>
            <input
                type="password"
                className="resetpassword_input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <label htmlFor="" className="resetpassword_label">
                Confirm Password:
            </label>
            <input
                type="password"
                className="resetpassword_input"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
            />

            <button
                type="submit"
                className="resetpassword_button"
                onClick={handleSubmit}
                disabled={response.loading}
            >
                {response.loading ? "Loading..." : "Confirm"}
            </button>

            <div className="resetpassword_message">{response.message}</div>
        </form>
    );
};

export default ResetPassword;

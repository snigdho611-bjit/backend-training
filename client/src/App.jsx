import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ForgetPassword from "./components/pages/ForgotPassword";
import Login from "./components/pages/Login";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/forgot-password" element={<ForgetPassword />} />
        <Route
          path="/reset-password/:token/:userId"
          element={
          // <ResetPassword />
        }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ForgetPassword from "./components/pages/ForgotPassword";
import ResetPassword from "./components/pages/ResetPassword";
import Login from "./components/pages/Login";
import AddFile from "./components/pages/AddFile";
import GetFile from "./components/pages/GetFile";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/forgot-password" element={<ForgetPassword />} />
        <Route
          path="/reset-password/:token/:userId"
          element={<ResetPassword />}
        />
        <Route path="/login" element={<Login />} />
        <Route path="/files/add" element={<AddFile />} />
        <Route path="/files/get" element={<GetFile />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

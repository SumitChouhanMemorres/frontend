import "./App.css";
import React from "react";
import { Route, Routes } from "react-router-dom";
import Chat from "./components/Chat";
import Login from "./components/Login";

function App() {
  return (
    <Routes>
      <Route exact path="/" element={<Login />} />
      <Route path="/:room" element={<Chat />} />
    </Routes>
  );
}

export default App;

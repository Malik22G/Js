import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./Home";
import Profile from "./Profile";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home/>} />
      <Route path="/profile/:characterId" element={<Profile/>} />
    </Routes>
  );
}

export default App;

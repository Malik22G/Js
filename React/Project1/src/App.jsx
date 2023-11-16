<<<<<<< HEAD
import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
=======
import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./Home";
import Profile from "./Profile";
>>>>>>> b67b01ef4937e069c0e896f0b68dfed4b0e192cd

function App() {
  return (
<<<<<<< HEAD
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
=======
    <Routes>
      <Route path="/" element={<Home/>} />
      <Route path="/profile/:characterId" element={<Profile/>} />
    </Routes>
  );
>>>>>>> b67b01ef4937e069c0e896f0b68dfed4b0e192cd
}

export default App;

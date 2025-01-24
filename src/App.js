import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { NavBarCustom } from "./components/navBarCustom";

// Pages and Components
import Home from './pages/Home';
import About from './pages/about';

// Layout component for pages with the navbar
const Layout = () => (
  <div>
    <NavBarCustom />
    <div className="content">
      <Outlet />
    </div>
  </div>
);

function App() {
  return (
    <Router basename="/smartLock">
      <Routes>
        {/* Redirect root "/" to "/about" */}
        <Route path="/" element={<Navigate to="/about" replace />} />

        {/* Routes with Layout */}
        <Route path="/" element={<Layout />}>
          <Route path="/home" element={<Home />} />
          <Route path="/about" element={<About />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;

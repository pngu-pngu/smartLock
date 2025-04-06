//import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { NavBarCustom } from "./components/navBarCustom";

// Pages and Components
import Home from './pages/Home';
import About from './pages/about';
import History from './pages/History';
import Profile from './pages/Profile';
import Trusted from './pages/Trusted';
import SignInUp from './pages/signInUp';
import UserContext from './context/UserContext'; 
import React, { useState } from 'react';


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
  const [user, setUser] = useState({ givenName: "" });

  return (
    <UserContext.Provider value={{ user, setUser }}>
      <Router basename="/smartLock">
      <Routes>
          {/* Sign In / Sign Up page (outside layout) */}
          <Route path="/SignInUp" element={<SignInUp />} />

          {/* All routes with navbar/layout */}
          <Route element={<Layout />}>
            <Route path="/" element={<Navigate to="/home" replace />} />
            <Route path="/home" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/History" element={<History />} />
            <Route path="/Profile" element={<Profile />} />
            <Route path="/Trusted" element={<Trusted />} />
          </Route>
        </Routes>
      </Router>
    </UserContext.Provider>
  );
}


export default App;

import React from 'react';
import './App.css';
import axios from 'axios';
import { Amplify } from 'aws-amplify';
import { withAuthenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
//import awsExports from './aws-exports';
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom'; // Import Outlet here
import { NavBarCustom } from "./components/navBarCustom";

// Pages and Components
import Home from './pages/Home';
import About from './pages/about';


// Configure Amplify
//Amplify.configure(awsExports);

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
    <div className="App">

      <Router>
        <Routes>
          {/* Routes with Layout */}
          <Route path="/" element={<Layout />}>
            <Route path="/home" element={<About />} />
            <Route path="/about" element={<About />} />
          </Route>
        </Routes>
      </Router>

    </div>
  );
}

export default App;

















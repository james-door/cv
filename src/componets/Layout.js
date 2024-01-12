import React, { useState, useEffect } from 'react';
import { Link } from 'gatsby';
import '../styles/global.css';
import Icon from "../assets/darkModeSun.svg";

export default function Layout({ children }) {
  const [darkModeState, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('darkModeState') || 'light';
    }
    return 'light';
  });

  useEffect(() => {
    document.documentElement.setAttribute('colour-theme', darkModeState);
  }, [darkModeState]);

  useEffect(() => {
    if (typeof window !== 'undefined' && !localStorage.getItem('darkModeState')) {
      localStorage.setItem('darkModeState', 'light');
    }
  }, []);

  const changeDarkMode = () => {
    const newState = darkModeState === 'light' ? 'dark' : 'light';
    setDarkMode(newState);
    localStorage.setItem('darkModeState', newState);
  };

  return (
    <div>
      <button onClick={changeDarkMode} className='dark-mode-button' aria-label="Toggle Dark Mode">
        <Icon className ='test-style'/>
      </button>
      <Link to='/'>Home</Link>
      {children}
    </div>
  );
}

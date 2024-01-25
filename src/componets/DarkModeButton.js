import React, { useState, useEffect } from 'react';
import Sun from "../assets/sun.svg";
import Moon from "../assets/moon.svg"
export default function DarkModeButton() {
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
    <button onClick={changeDarkMode} className='dark-mode-button'>
    <span >
    <div className='circle-left'/>
    <div className='circle-right'/>
    <Sun className = 'sun-button'/>
    <Moon className = 'moon-button'/>
    </span>
    </button>
  )
}

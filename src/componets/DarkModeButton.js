import React, { useState, useEffect } from 'react';
import Icon from "../assets/darkModeSun.svg";
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
    <Icon/>
    </button>
  )
}

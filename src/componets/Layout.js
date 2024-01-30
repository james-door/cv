import React from 'react';
import '../styles/global.css';
import Banner from "./Banner.js"
import ContactBar from './ContactBar.js';
import DarkModeButton from './DarkModeButton.js';

export default function Layout({ children }) {
  return (
    <div className='flex-box'>
    <main className = 'content-column'>
      {<Banner/>}
      {children}
    </main>
    <DarkModeButton/>
    <ContactBar/>
    </div>
  );
}

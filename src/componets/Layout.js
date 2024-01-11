import React, {useState,useEffect } from 'react'
import '../styles/global.css'
import { Link } from 'gatsby';






export default function Layout({children}) {
const inBrowser = typeof window !== 'undefined';

const [darkModeState,setDarkMode] = useState(inBrowser ? localStorage.getItem('darkModeState') : null);
useEffect(() => {
  if (darkModeState !== null) {
    document.documentElement.setAttribute('colour-theme', darkModeState);
  }
}, [darkModeState]);



const ChangeDarkMode = ()=>{  
  const newState = darkModeState === 'light' ? 'dark' : 'light';
  setDarkMode(newState);
  localStorage.setItem('darkModeState',newState);
  console.log(newState);
}

if(inBrowser && darkModeState == null){
  localStorage.setItem('darkModeState','light');
  setDarkMode('light');
}


 return (
  
    <div>
        <button onClick={ChangeDarkMode} className='dark-mode-button'>
      mode
      </button>
      <Link to='/'>Home</Link>
   
        {children}
    </div>
  )
}

import React, {useState,useEffect } from 'react'
import '../styles/global.css'
import { Link } from 'gatsby';






export default function Layout({children}) {
const [darkModeState,setDarkMode] = useState(localStorage.getItem('darkModeState'));

useEffect(() => {
  if (darkModeState !== null) {
    document.documentElement.setAttribute('colour-theme', darkModeState);
  }
}, [darkModeState]);


if(darkModeState == null){
  localStorage.setItem('darkModeState','light');
  setDarkMode('light');
}

const ChangeDarkMode = ()=>{  
  const newState = darkModeState === 'light' ? 'dark' : 'light';
  setDarkMode(newState);
  localStorage.setItem('darkModeState',newState);
  console.log(newState);
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

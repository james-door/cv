import React, { useEffect, useState, useCallback } from 'react';
import * as styles from '../styles/project.module.css';

export default function PageNavigationColumn(props) {
  const [activeHeader, setActiveHeader] = useState('');

  const currentViewportHeader =() => {
    const elements = document.querySelectorAll('h1[id], h2[id], h3[id]');
    for (let el of elements) {
      const rect = el.getBoundingClientRect();
      if (rect.top > -50 && rect.top < 0) {
        return el.innerText;
      }
      else if(el.tagName ==='H1' && rect.top > 0){
        return el.innerText
      }
    }
    return activeHeader;
  }
  ;
  const handleScroll = ()=>{
    const current = currentViewportHeader();
    console.log(current);
    if(current !==''){
      setActiveHeader(current);
    }
  };

  const handleHashChange = () => {
    setActiveHeader(window.location.hash.substring(1).replace(/%20/g, ' '));
  };

  useEffect(() => {
    window.addEventListener('hashchange', handleHashChange);
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const FormatHeadingList = (headingList) => {
    let style = '';
    //Exclude h1
    if (headingList.depth === 1) {
      return <></>;
    }
    //If selected use the activeHeader style
    if (headingList.value === activeHeader) {
      style = styles.selectedHeader;
    }
    return (
      <li className={`${styles[`depth${headingList.depth}`]} ${style}`}>
        <a href={`#${headingList.value}`}>
          {headingList.value}
        </a>
      </li>
    );
  };

  return (
    <div className={styles.headerNav}>
    <h2>Page Contents</h2>
    <ul>
      {props.HeadingData.map(FormatHeadingList)}
    </ul>
    </div>
  );
}

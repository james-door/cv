import React from 'react'
import * as styles from "../styles/project.module.css"

function FormatHeadingList(headingList){
  if(headingList.depth === 1)
    return(<></>);
  return(
          <li className={styles[`depth${headingList.depth}`]}>
          <a href={`#${headingList.value}`}>
            {headingList.value}
          </a>
          </li>
       )
}

export default function PageNavgiationColumn(props) {


  
  return (
    <ul className={styles.headerNav}>
      {props.HeadingData.map(FormatHeadingList)}
    </ul>
  );
}



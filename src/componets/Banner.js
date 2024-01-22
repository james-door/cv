import { Link } from 'gatsby'
import React from 'react'

export default function Banner() {
  return (
    <div className = 'banner-style'>
        <Link to="/">
        <h1>James Wood</h1>
        <h2>Portfolio Website</h2>
        {/*<hr className='line'/>*/}
        </Link>
    </div>
  )
}

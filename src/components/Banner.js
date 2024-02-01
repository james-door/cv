import { Link } from 'gatsby'
import React from 'react'

export default function Banner() {
  return (
    <div className = 'banner-style'>
        <Link to="/">
        <h1 className="highlight-effect">James Wood</h1>
        </Link>
    </div>
  )
}

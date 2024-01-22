import React from 'react'
import EmailIcon from "../assets/email.svg";
import GithubIcon from "../assets/githubMark.svg"

export default function ContactBar() {
  return (
    <footer>
      <a href='https://github.com/james-door'>
      <GithubIcon/>
      </a>
      <a href='mailto:james.wood0042@gmail.com'>
      <EmailIcon/>
      </a>
    </footer>
  )
}

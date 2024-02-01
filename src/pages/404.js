import React from 'react'
import * as styles from "../styles/noPage.module.css"
import Layout from '../components/Layout'
import { Link } from 'gatsby'

export default function NoPage() {
  return (
    <Layout>
    <section className={styles.noPage}>
      <h2>404 - No Page Found</h2>
     
    </section>
    </Layout>
  )
}

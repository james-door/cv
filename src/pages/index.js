import * as React from "react"
import Layout from "../componets/Layout"
import * as styles from "../styles/home.module.css"
import { graphql,Link} from "gatsby"
import { useEffect } from "react"



export default function Home({data}) {



  const projectList = data.allMarkdownRemark.nodes.map((element,index) => (
    <Link to={element.frontmatter.URLslug} key={element.id}>
    <li>{element.frontmatter.title}</li>
    </Link>
    ))

  return(

    <Layout>
      <section className={styles.header}>
        <h1>
          Jimboomba Woods
        </h1>
        <ol>
          {projectList}
        </ol>

      </section>
    </Layout>


  )
}


export const query = graphql`
query ProjectPages {
  allMarkdownRemark {
    nodes {
      frontmatter {
        title
        URLslug
      }
      id
    }
  }
}
`
import * as React from "react"
import Layout from "../componets/Layout"
import * as styles from "../styles/home.module.css"
import { graphql,Link} from "gatsby"



export default function Home({data}) {



  const projectList = data.allMarkdownRemark.nodes.map((element,index) => (
    <Link to={element.frontmatter.URLslug} key={element.id}>
    <li>
      <span className={styles.date}>
        {element.frontmatter.date}
      </span>
      <span>
      {" " +element.frontmatter.title}
      </span>
      </li>
    </Link>
    ))

  return(

    <Layout>
      <section className={styles.header}>
        <h2>
          About Me
        </h2>
        <p>
          I am in my last year at QUT doing a Computer and Software Systems course. I enjoy learning new API/langauges. 
          And I am currently intersted in computer graphics. 
        </p>
        <h2>Projects: </h2>
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
        date
      }
      id
    }
  }
}
`
import * as React from "react"
import Layout from "../components/Layout"
import * as styles from "../styles/home.module.css"
import { graphql,Link} from "gatsby"



export default function Home({data}) {
  const formatDate = (date)=>{
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const dateSegments = date.split('/')
    return `${dateSegments[0].length === 1 ? '0' : ''}${dateSegments[0]}
    ${months[parseInt(dateSegments[1], 10) - 1]} ${dateSegments[2]}`;

  }


  const projectList = data.allMarkdownRemark.nodes.map((element,index) => (
    <li key={element.id}>
       <span className={styles.date}>
          {`${formatDate(element.frontmatter.date)} `}
      </span>
    <Link to={element.frontmatter.URLslug} >
      <span>
        {element.frontmatter.title}
      </span>
    </Link>
    </li>
    ))

  return(

    <Layout>
      <section className={styles.header}>  
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
  allMarkdownRemark(sort: {frontmatter: {date: ASC}}) {
    nodes {
      id
      frontmatter {
        title
        URLslug
        date
      }
    }
  }
}
`
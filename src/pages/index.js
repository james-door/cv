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
        <h2>
          About Me
        </h2>
        <p>
          Hello, my name is James. I enjoy learning about new languages and APIs. Currently,
          my primary areas of interest lie in web development and computer graphics. 
        </p>
        <p>
           I am currently in my final year at QUT, studying Computer and Software Systems.
            Throughout this course, I have gained experience in web development. This 
            inspired me to start creating this website, designed to showcase and detail 
            some of my personal projects. 
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
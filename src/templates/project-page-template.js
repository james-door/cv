import React from 'react'
import {graphql} from 'gatsby'
import * as styles from "../styles/project.module.css"
import Layout from '../componets/Layout'

import parse, { domToReact } from 'html-react-parser';

import PageNavgiationColumn from "../componets/PageNavgiationColumn"



const FileLink = (value) =>{
  value = value.split(' ')[1];
  const pathAndEmbed = value.split('__');
  if(pathAndEmbed.length ===1){
    return(
      <>
      {pathAndEmbed[0]}
      </>
    )
  }
  return(
    <>
    {pathAndEmbed[0] +" - "}
    <a href={pathAndEmbed[2]}>{pathAndEmbed[1]}</a>
    </>
  )
};

const HtmlManipulator = (htmlContent) => {
  return parse(htmlContent, {
    transform(reactNode, domNode) {
      if (domNode.type === 'tag' && ['h2', 'h3'].includes(domNode.name)){
        return (
          React.createElement(
            domNode.name,
            { id: domNode.children[0].data},
            domToReact(domNode.children, {})
          )
        );
      }
      else if (domNode.attribs && domNode.attribs.class && domNode.attribs.class.includes('grvsc-container')) {
      return( 
        <>
        <div className={styles.test}>{FileLink(domNode.attribs.class)}</div>
          {reactNode}  
        </>
        );
      }
      else{
        return(<>{reactNode} </>)
      }
    },
  });
};



export default function PageFormat({data}) {

  
  return (
    <Layout>
      <PageNavgiationColumn HeadingData={data.markdownRemark.headings}/>
      <section className={styles.header}>
       {HtmlManipulator(data.markdownRemark.html)}
      </section>
    </Layout>
  )
}


export const query = graphql`
query PageContnet($slug: String) {
  markdownRemark(frontmatter: {URLslug: {eq: $slug}}, html: {}) {
    headings {
      value
      depth
    }
    html
  }
}
`
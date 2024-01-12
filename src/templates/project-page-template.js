import React from 'react'
import {graphql} from 'gatsby'
import * as styles from "../styles/project.module.css"
import Layout from '../componets/Layout'

import parse from 'html-react-parser';




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
    transform(reactNode, domNode, index) {
      // this will wrap every element in a div
      if (domNode.attribs && domNode.attribs.class && domNode.attribs.class.includes('grvsc-container')) {
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
      <section className={styles.header}>
       {HtmlManipulator(data.markdownRemark.html)}
       {/*<html dangerouslySetInnerHTML={{__html: data.markdownRemark.html}}/>*/}
      </section>
    </Layout>
  )
}


export const query = graphql`
query PageContent($slug:String){
  markdownRemark(frontmatter: {URLslug: {eq: $slug}}) {
    html
  }
}
`
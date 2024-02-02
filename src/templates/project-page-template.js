import React from 'react'
import {graphql} from 'gatsby'
import * as styles from "../styles/project.module.css"
import Layout from '../components/Layout'

import parse, { domToReact } from 'html-react-parser';

import PageNavigationColumn from "../components/PageNavigationColumn"



const FileLink = (value) =>{
  value = value.split(' ')[1];
  const pathAndEmbed = value.split('__');
  if(pathAndEmbed.length ===1){
    return(
      <div className='test'>
      {pathAndEmbed[0]}
      </div>
    )
  }
  return(
    <>
    <span>
        {`${pathAndEmbed[0]} -`}
    </span>
    <a href={pathAndEmbed[2]}>
      {pathAndEmbed[1]}</a>
    </>
  )
};

const HtmlManipulator = (htmlContent) => {
  return parse(htmlContent, {
    transform(reactNode, domNode) {
    
      if (domNode.type === 'tag' && ['h1', 'h2', 'h3'].includes(domNode.name)){
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
        <div className={styles.codeFenceBar}>{FileLink(domNode.attribs.class)}</div>
          {reactNode}  
        </>
        );
      }
      else{
        return(<>{reactNode}</>)
      }
    },
  });
};



export default function PageFormat({data}) {
  return (
    <Layout>
      <section className={styles.projectBody}>
      <PageNavigationColumn HeadingData={data.markdownRemark.headings}/>
       {HtmlManipulator(data.markdownRemark.html)}
      </section>
    </Layout>
  )
}

export const query = graphql`
query PageContent($slug: String) {
  markdownRemark(frontmatter: {URLslug: {eq: $slug}}) {
    headings {
      value
      depth
    }
    html
  }
}
`
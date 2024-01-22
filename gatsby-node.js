const path = require('path');
const cheerio = require('cheerio');

exports.createPages = async ({graphql,actions})=>{

    const {data} = await graphql(`
    query ProjectPages {
        allMarkdownRemark {
          nodes {
            frontmatter {
              URLslug
            }
          }
        }
      }
    `)

    data.allMarkdownRemark.nodes.forEach(page=>{
        actions.createPage({
            path: page.frontmatter.URLslug,
            component: path.resolve("src/templates/project-page-template.js/"),
            context: {slug:page.frontmatter.URLslug}
        })
        
    })


};



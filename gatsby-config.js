/**
 * Configure your Gatsby site with this file.
 *
 * See: https://www.gatsbyjs.com/docs/reference/config-files/gatsby-config/
 */

/**
 * @type {import('gatsby').GatsbyConfig}
 */


module.exports = {
  pathPrefix: "/cv",

  plugins: [
    {
    resolve: "gatsby-plugin-react-svg",
    options: {
      rule: {
        include: /assets/ 
      }
    }
  },
    `gatsby-plugin-image`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `personalProjectsMarkup`,
        path: `${__dirname}/src/personalProjectsMarkup/`,
      },
    },
    {
    resolve: `gatsby-transformer-remark`,
    options: {
      plugins: [
        {
          resolve: `gatsby-remark-images`,
          options: {
            maxWidth: 590,
          }
        },

        {
        resolve: `gatsby-remark-vscode`,
        options: {
          extensions: ['cmake-language-support-vscode'],

          inlineCode: {
            marker: '•',
            className: 'custom-inline-code'
          },
          theme:{
            default: 'Solarized Light',
            parentSelector: {
              'html[colour-theme=light]': 'Solarized Light',
              'html[colour-theme=dark]': 'Solarized Dark',
            },
        },
         wrapperClassName: ({ parsedOptions, language, markdownNode, node }) => {
         const filePath = parsedOptions.filePath;
          if (filePath) {
             return `${language.toUpperCase()}__${filePath.path}__${filePath.link}#L${parsedOptions.numberLines}`;
          }
          return language.toUpperCase();
          }
        }
      }

        
    
    ]
    }
  }]
}

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
      resolve: `gatsby-source-filesystem`,
      options: {
        // The unique name for each instance
        name: `personalProjectsMarkup`,
        // Path to the directory
        path: `${__dirname}/src/personalProjectsMarkup/`,
      },
    },
    {
    resolve: `gatsby-transformer-remark`,
    options: {
      plugins: [{
        resolve: `gatsby-remark-vscode`,
        options: {
      
          inlineCode: {
            marker: '•',
            className: 'custom-inline-code'

          },
          theme:{
            default: 'Solarized Light',
            parentSelector: {
              'html[colour-theme=light]': 'Solarized Light',
              'html[colour-theme=dark]': 'Dark+ (default dark)',
            },
        },
        wrapperClassName: ({ parsedOptions, language, markdownNode, node }) => {
      // Access the 'someNumbers' option
      const filePath = parsedOptions.filePath;
      if (filePath) {
        return language.toUpperCase()+"-"+filePath.path +"-"+filePath.link;
      }
      // Default class name if 'someNumbers' isn't provided
      return '';
    }
        }
      }]
    }
  }]
}

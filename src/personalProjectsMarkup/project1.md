---
title: website
URLslug: projects/website
---

# The Website
## Component Modules

In traditional CSS, styles are defined globally, meaning any style rule can potentially affect any
element in the HTML document if the selectors match. Gatsby uses [CSS Modules](https://github.com/css-modules/css-modules)  
...  
For instance the JSX which 
```jsx {numberLines}
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
```
...  
...   
This Creates the css code
```css {numberLines}
.grvsc-line {
  padding-left: var(--grvsc-padding-left, var(--grvsc-padding-h, 1.5rem));
  padding-right: var(--grvsc-padding-right, var(--grvsc-padding-h, 1.5rem));
}
```

## Markdown
I wanted to write the project pages in Markdown. In Gatsby we can do this by using node in the gatsby-node.js
## Code Fence
The code fences in the project pages consists of a syntax higlighter and a bar above the code indicating the language and the file path in the project's repiostry. The file path has the link to the github page embedded.
### Syntax Highlighter 
For the syntax highlighter I used the [gatsby-remark-vscode](https://www.gatsbyjs.com/plugins/gatsby-remark-vscode/) plugin. This syntax highlighter ... 

Most other syntax highlighters I looked at were client-side. This meant they had to be realtively fast and lighweight as they are downloaded and executed whenever the page is loaded. [gatsby-remark-vscode](https://www.gatsbyjs.com/plugins/gatsby-remark-vscode/) takes advantage of SSG and generates the HTML in the node.js environment sitting on [gatsby-transformer-remark](https://www.gatsbyjs.com/plugins/gatsby-transformer-remark/). Becuase of this [gatsby-remark-vscode](https://www.gatsbyjs.com/plugins/gatsby-remark-vscode/) opts to use the VS Code's syntax highlighter which while larger and slower peforms more accurate syntax highlighting. The plugin exposes a number of CSS classes that can be used to style the code fences. The main one being `CSS•grvsc-container` which is at the top of the hierarchy.

```CSS {numberLines : 70,filePath:{path:'cv/src/styles/global.css',link:'https://github.com/james-door/cv/blob/main/src/styles/global.css'}}
.grvsc-container{
    width:  600px;
    margin-top: 0rem; 
    margin-bottom: 1rem; 
}
.grvsc-container code{
    width: 600px;
}
.grvsc-line-number {
    width: 0px;
}
.grvsc-gutter-pad{
    width: 0px;
}
:root{
    --grvsc-border-radius: 10px;
    --grvsc-padding-top: 2rem;
    --grvsc-padding-bottom: 0rem;
}
```


### Bar
Initially I implemented the bar using the `CSS•::before` selector as is seen in the below code. However, using this method I was only able to incude the langauge and wasn't able to pass other information from the markdown such as the file. Moreover, the bar wouldn't be the right width when there was overflow in the `CSS•:grvsc-container`, such when scrolling you would go past the right edgeo of the bar. Instead I used a HTML parser to insert the bars above every code fence.

```CSS {numberLines}
.grvsc-container[data-language]::before{
    content: attr(data-language);
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    width: 100%;
    text-align: center;
    background-color: var(--code-block-colour);
}
```
One of the features of the [gatsby-remark-vscode](https://www.gatsbyjs.com/plugins/gatsby-remark-vscode/) is the ability to add a custom class to `CSS•:grvsc-container`. This is specified as one of hte plugins options

```JS {numberLines: 51, filePath: {path:'cv/gatsby-config.js',link: 'https://github.com/james-door/cv/blob/main/gatsby-config.js'}}
        wrapperClassName: ({ parsedOptions, language, markdownNode, node }) => {
      // Access the 'someNumbers' option
      const filePath = parsedOptions.filePath;
      if (filePath) {
        return language.toUpperCase()+"__"+filePath.path +"__"+filePath.link+"#L"+parsedOptions.numberLines;
      }
      return language.toUpperCase();
    }
        }
```
## Dark Mode
To enable switching betweeen a dark and light mode I defined the colour properties for every element using CSS custom properties. The switch between light and dark modes is controlled by changing the `CSS•"colour-theme"` attribute. Depending on its value (either `CSS•"light"` or `CSS•"dark"`), different sets of CSS custom properties are applied through attribute selectors

```CSS {numberLines : 15,filePath:{path:'cv/src/styles/global.css',link:'https://github.com/james-door/cv/blob/main/src/styles/global.css'}}
/*Light And Dark Mode*/
[colour-theme="dark"] {
    --code-block-colour: #d04949;
    --background-colour: rgb(147, 147, 147);
    --inline-code-colour: white;
    --inline-code-background: black;
    --dark-mode-button-colour: rgb(93, 164, 159); 
}
[colour-theme="light"] {
--code-block-colour: #f7df1e;
--background-colour: white;
--inline-code-colour: black;
--inline-code-background: #FDF6E3;
--dark-mode-button-colour: rgb(130, 130, 130); 
}
```
CSS custom properties are inherited like other CSS properties. To ensure that every element can inherit the styles, I assigned the `css•colour-theme` attribute to the root element, `html•<html>`. This done when a page is first loaded ss
```JSX {numberLines,filePath:{path:'github/cv/file1',link:'https://github.com/james-door/cv/blob/main/src/pages/index.js'}}
const [darkModeState,setDarkMode] = useState(localStorage.getItem('darkModeState'));

useEffect(() => {
  if (darkModeState !== null) {
    document.documentElement.setAttribute('colour-theme', darkModeState);
  }
}, [darkModeState]);
if(darkModeState == null){
  localStorage.setItem('darkModeState','light');
  se
```

For the syntax highlighter 



fin

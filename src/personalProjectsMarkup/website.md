---
title: website
URLslug: projects/website
date: 19/01/2024
---

# Project: Website
## Design
For the font size I knew I was going to use `CSS•rem.s` for units..  
The default font size is most browsers is 16px. For the design I used the ... ratio for the header size..  
For the width on the pages I used the `CSS•cv` unit, so that it would be roughly 45 characters per line, probs different for..  

For Desktop one rule of thumb I found was 45 to 80 characters per line... 

For Mobile one rule of thumb I found was 30-50 characters per line
### Headers
To create contrast between the header and paragraph text the header text colour is darker than the paragraph text colour in light mode and is lighter in dark mode. Moreover, I used a Serif font for the headers and a sans serif font for the paragraph text. I decided to use 4 different text sizes using a golden ratio. Given that the default font size for most browsers is 16 px this when rounding up we get the following
|Element|Size (px)|Size (rem)|
|-------|---------|----------|
|p||16||1|
|h4|26||..|
|h3|42||..|
|h2|68||..|
|h1|110||..|

Using `CSS•rem` units if the user has a browser set size it will maintain the ratio while keeping t
### Style
To create the stlye I used Figma
### Global
To have consisten global styling for the hyperlinks hover I specify 

```CSS {numberLines:10}
body a::after{
    margin: -3px 0;
    content: '';
    display: block;
    height: 2px;
    background: currentColor; /* Use the color of the text */
    transition: width 0.5s;
    position: absolute;
    left: 50%;
    bottom: 0;
    transform: translateX(-50%); /* Center the pseudo-element */
    border-radius: 10px;
    width: 100%;

}
body a:hover::after{
    width: 100%;
}


```


## Component Modules
### SUBA

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
### Generating HTML
I decided to write the content for the project pages in Markdown. markdown parser->graphql... parses to get information from the markdown such as the headers. the contnet and the front matter..  
In Gatsby when we export a GraphQL query from a page component Gatsby automatically executes the query during the build process injecting the query result into the pages component's props. In the below code `jsx•query` is exported which injects parsed content into the `jsx•data prop`. I then use the headers to generate the create the [navigation column](#Navigation%20Column) component and parse the markdown into HTML.
```jsx {numberLines:59, filePath:{path:'cv/src/templates/project-page-template.js', link:'https://github.com/james-door/cv/blob/main/src/templates/project-page-template.js'}}
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
```
### Generating the Page
In Gatsby to generate the page we use gatsby-node.js


Gatsby we can do this by using node in the gatsby-node.js
### SUBB
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
Initially I implemented the bar using the `CSS•::before` selector as is seen in the below CSS. However, using this method I was only able to incude the langauge and wasn't able to pass other information from the markdown such as the file. Moreover, the bar wouldn't be the right width when there was overflow in the `CSS•grvsc-container`, such when scrolling you would go past the right edgeo of the bar. Instead I used a HTML parser to insert the bars above every code fence.

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
One of the features of the [gatsby-remark-vscode](https://www.gatsbyjs.com/plugins/gatsby-remark-vscode/) is the ability to add a custom class to `CSS•grvsc-container`. The custom class is added by specifying the name of the class as the value of the `JS•wrapperClassName` property of the plugin's option object. This class name can optionally be returned by a JS funciton. This function has two useful parameters, `JS•parsedOptions` which allows us to pass a custom object from the markdown and `JS•langauge` which is the language of the code fence. I pass the custom `JS•filePath` object from the markdown which specifies the file path and a link to the Github page. Using this information I set the custom class `CSS•grvsc-container` to contain this information, using `JS•__` as a delimter. Also I appended the `JS•numberLines` property to the Github URL with the fragment identifier #L, which Github uses to allow jumping to a particular line of code.

```JS {numberLines: 51, filePath: {path:'cv/gatsby-config.js',link: 'https://github.com/james-door/cv/blob/main/gatsby-config.js'}}
        wrapperClassName: ({ parsedOptions, language, markdownNode, node }) => {
      const filePath = parsedOptions.filePath;
      if (filePath) {
        return language.toUpperCase()+"__"+filePath.path +"__"+filePath.link+"#L"+parsedOptions.numberLines;
      }
      return language.toUpperCase();
    }
```
To actually create the bar this is done in the tempalte

```JS {numberLines: 29}
const HtmlManipulator = (htmlContent) => {
  return parse(htmlContent, {
    transform(reactNode, domNode, index) {
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

```





## Dark Mode
### Styling
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

The syntax highighter allows usto change style

### Button
The button that toggles between dark and light mode, in the bottom left, is an SVG loaded using the Gatsby plugin [gatsby-plugin-react-svg](https://www.gatsbyjs.com/plugins/gatsby-plugin-react-svg). This plugin converts SVG files from a specified directory into importable React components. I specified in the plugin options that this the src/assets directory. The inline stroke attributes was removed from the in the [orignal SVG](https://www.reshot.com/free-svg-icons/item/sun-energy-WL9MVB4TYD/). And set it using the custom property `CSS•--dark-mode-button-colour`. This allowed me to avoiud using the !important property to override the in-line style.

```CSS {numberLines: 10}
.dark-mode-button {
    position: fixed;
    bottom: 1rem;
    right: 1rem;
    z-index: 1;
    width: 5rem; 
    height: 5rem; 
    background-color: transparent;
    cursor: pointer;
    transition:  transform 0.3s;
    transition-timing-function: ease-out;
    stroke: var(--dark-mode-button-colour);

}
.dark-mode-button:hover {
    transform: scale(1.2);
}

```
## Navigation Column
In order to make navigation in project pages easier, for each project's page, a list of anchors is generated which facilitates easier access to sections marked as `CSS•<h2>` and `CSS•<h3>`. The list is displayed on the left of the page and, using media queries, it will not be displayed if there is insufficient room. Navigation is achieved using URL fragments. I use the html-react-parser to transform the `CSS•<h2>` and `CSS•<h3>` elements so that each has an ID corresponding to its header text, as seen in the below React code. Fragment identifiers must be unique; thus, each header must have a unique identifier.

```JSX {numberLines: 32, filePath:{path:'cv/src/templates/project-page-template.js', link:'https://github.com/james-door/cv/blob/main/src/templates/project-page-template.js'}} 
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
```

The navigation column is a React component `JSX•PageNavigationColumn`. The component is passed a single prop which is an array of JS objects containing the depth and value for header in the page. Each header is passed to `JSX•FormatHeadingList`. The depth of the header passed determines which CSS module is attatched to the list item element. Moreover, use React state varaible `JSX•activeHeader` I keep track of which header is currently selected, and add the `CSS•selectedHeader` stlye to that header. 

```JSX {numberLines: 4, filePath: {path: 'cv/src/Componets/PageNavigationColumn',link: 'https://github.com/james-door/cv/blob/main/src/componets/PageNavgiationColumn.js'}}
 export default function PageNavigationColumn(props) {
  const [activeHeader, setActiveHeader] = useState('');
                            ...
  const FormatHeadingList = (headingList) => { //L45
    let style = '';
    //Exclude h1
    if (headingList.depth === 1) {
      return <></>;
    }
    //If selected use the activeHeader style
    if (headingList.value === activeHeader) {
      style = styles.selectedHeader;
    }
    return (
      <li className={`${styles[`depth${headingList.depth}`]} ${style}`}>
        <a href={`#${headingList.value}`}>
          {headingList.value}
        </a>
      </li>
    );
  };

  return (
    <div className={styles.headerNav}>
    <h2>Page Contents</h2>
    <ul>
      {props.HeadingData.map(FormatHeadingList)}
    </ul>
    </div>
  );
}
```

### Selected Header
 I used a useEffect hook to add the listeners `JSX•hashchange` and `JSX•scroll` whenever the the component is mounted. And I remove the listeners when the component is demounted. A header is selected if the the top of the view port goes within 0 to 50 pixels above that header, or if the viewport is above the main header for the page, or if the user uses a fragment identifier to navigate to the header. 
```JSX {numberLines: 7, filePath: {path: 'cv/src/componets/PageNavigationColumn',link:}}
  const currentViewportHeader =() => {
    const elements = document.querySelectorAll('h1[id], h2[id], h3[id]');
    for (let el of elements) {
      const rect = el.getBoundingClientRect();
      if (rect.top > -50 && rect.top < 0) {
        return el.innerText;
      }
      else if(el.tagName ==='H1' && rect.top > 0){
        return el.innerText
      }
    }
    return activeHeader;
  }
  ;
  const handleScroll = ()=>{
    const current = currentViewportHeader();
    console.log(current);
    if(current !==''){
      setActiveHeader(current);
    }
  };

  const handleHashChange = () => {
    setActiveHeader(window.location.hash.substring(1).replace(/%20/g, ' '));
  };

  useEffect(() => {
    window.addEventListener('hashchange', handleHashChange);
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

```








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
## Dark Mode
To enable switching betweeen a dark and light mode I defined the colour properties for every element using CSS custom properties. The switch between light and dark modes is controlled by changing the `CSS•"colour-theme"` attribute. Depending on its value (either `CSS•"light"` or `CSS•"dark"`), different sets of CSS custom properties are applied through attribute selectors

```CSS {numberLines,filePath:{path:'github/cv/file2',link:'https://github.com/james-door/cv/blob/main/gatsby-config.js'}}
/*Light And Dark Mode*/
[colour-theme="dark"] {
    --code-block-colour: #d04949;
    --background-colour: rgb(147, 147, 147);
}

[colour-theme="light"] {
  --code-block-colour: #f7df1e;
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

# Portfolio Website 

## Install Gatsby CLI

To get started, you need to install the Gatsby CLI globally. Open the terminal and run:

```sh
npm install -g gatsby-cli
```

## Develop

To build and host the site locally for development purposes, follow these steps:

1. Install the necessary packages:

```sh
npm install
```

2. Start the Gatsby development server:

```sh
gatsby develop
```

This command will build the site and host it locally. You can view it by navigating to `http://localhost:8000` in the web browser.

## Deploy to GitHub Pages

To deploy the Gatsby site to GitHub Pages, you'll use the `gh-pages` package. First, ensure you have the package installed as a dev dependency:

```sh
npm install gh-pages --save-dev
```

Next, run the deployment script in in the `package.json` file:

```json
"scripts": {
  "deploy": "gatsby build && gh-pages -d public"
}
```

This script builds the site using `gatsby build` and then deploys it to GitHub Pages using the `gh-pages` package. To deploy the site, run:

```sh
npm run deploy
```

Ensure your project's repository settings on GitHub are configured to serve the site from the `gh-pages` branch.

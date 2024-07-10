# Portfolio Website 

## Install Gatsby CLI

To get started, the Gatsby CLI must be installed globally. Once done, open the terminal and run:

```sh
npm install -g gatsby-cli
```

## Develop

To build and host the site locally for development purposes:

1. Install the necessary packages:

```sh
npm install
```

2. Start the Gatsby development server:

```sh
gatsby develop
```

This command will build the site and host it locally. Whcih can be viewed by navigating to `http://localhost:8000` in the web browser.

## Deploy to GitHub Pages

The  Gatsby site can be deployed using GitHub Pages, using the `gh-pages` package. First, ensure the package is installed as a dev dependency:

```sh
npm install gh-pages --save-dev
```

Next, run the deployment script in in the `package.json` file:

```json
"scripts": {
  "deploy": "gatsby clean && gatsby build && gh-pages -d public"
}
```

This script builds the site using `gatsby build` and then deploys it to GitHub Pages using the `gh-pages` package. In order for the path prefixes to work the Gatsby cache nears to be cleared before deploying. To deploy the site, run:

```sh
npm run deploy
```

Ensure the project's repository settings on GitHub are configured to serve the site from the `gh-pages` branch.

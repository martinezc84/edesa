var proxy = require('http-proxy-middleware')

module.exports = {
  siteMetadata: {
    title: 'Turnos SS 2019',
    description: `Control de turnos`,
    author: `@chuby`,
  },

  // for avoiding CORS while developing Netlify Functions locally
  // read more: https://www.gatsbyjs.org/docs/api-proxy/#advanced-proxying
  developMiddleware: app => {
    app.use(
      '/.netlify/functions/',
      proxy({
        target: 'http://localhost:9000',
        pathRewrite: {
          '/.netlify/functions/': '',
        },
      })
    )
  },

  plugins: [
    {
      resolve: `gatsby-plugin-netlify`,
      options: {
        headers: {'/*': [
          'Accept : application/json','Content-Type: application/json','X-User-Email: api@hermandadtrespotencias.com','X-User-Token:9exrqgKSyK4y8PHDrQRD']},                                  // option to add more headers. `Link` headers are transformed by the below criteria
       
      },
      allPageHeaders: [],                           // option to add headers for all pages. `Link` headers are transformed by the below criteria
      mergeSecurityHeaders: true,                   // boolean to turn off the default security headers
      mergeLinkHeaders: true,                      // boolean to turn off the default gatsby js headers (disabled by default, until gzip is fixed for server push)
      mergeCachingHeaders: true,                    // boolean to turn off the default caching headers
      transformHeaders: (headers, path) => headers,
    },
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-source-zauru`,
    },
    {
      resolve: `gatsby-plugin-create-client-paths`,
      options: { prefixes: [`/app/*`] },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `gatsby-starter-default`,
        short_name: `starter`,
        start_url: `/`,
        background_color: `#663399`,
        theme_color: `#663399`,
        display: `minimal-ui`,
        icon: `src/images/gatsby-icon.png`, // This path is relative to the root of the site.
      },
    },
    // this (optional) plugin enables Progressive Web App + Offline functionality
    // To learn more, visit: https://gatsby.app/offline
    // 'gatsby-plugin-offline',
  ],
}

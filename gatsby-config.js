let activeEnv = process.env.ACTIVE_ENV || process.env.NODE_ENV || 'development';

module.exports = {
	siteMetadata: {
		title: `Mover turnos`,
		description: `Mover turnos vendidos hacia turnos disponibles`,
		author: `@luispagarcia`,
		titulos:{
			landing: "Aplicación para reasignar turnos vendidos",
			app: "Aplicación para reasignar turnos turnos"
		},
		env: activeEnv
	},
	plugins: [
		`gatsby-plugin-react-helmet`,
		{
			resolve: `gatsby-source-filesystem`,
			options: {
				name: `images`,
				path: `${__dirname}/src/images`
			}
		},
		`gatsby-transformer-sharp`,
		`gatsby-plugin-sharp`,
		{
			resolve: `gatsby-plugin-manifest`,
			options: {
				name: `gatsby-starter-tailwind`,
				short_name: `starter`,
				start_url: `/`,
				background_color: `#ffffff`,
				theme_color: `#4dc0b5`,
				display: `minimal-ui`,
				icon: `src/images/tailwind-icon.png` // This path is relative to the root of the site.
			}
		},
		`gatsby-plugin-postcss`,
		{
			resolve: 'gatsby-plugin-purgecss',
			options: {
				tailwind: true,
				purgeOnly: [ 'src/css/style.css' ] // Purge only tailwind
			}
		}
		// this (optional) plugin enables Progressive Web App + Offline functionality
		// To learn more, visit: https://gatsby.app/offline
		// 'gatsby-plugin-offline',
	]
};

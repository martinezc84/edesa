import React, { Component } from 'react';
import { navigate } from 'gatsby';
import { Layout } from '../components/Layout';
import gatsbyConfig from '../../gatsby-config';
import '../css/style.css';
import 'bootstrap/dist/css/bootstrap.min.css';

export default class Index extends Component {
	componentDidMount() {
		

		
	}
	render() {
		let TituloPrincipal = gatsbyConfig.siteMetadata.titulos.app;
		return (
			<Layout>
				<div className="pt-8">
					<h1>{TituloPrincipal}</h1>
				</div>
			</Layout>
		);
	}
}

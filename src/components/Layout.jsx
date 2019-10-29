//@ts-check
import React, { Component } from 'react';
import { Header } from './Header';
import '../css/style.css';
import { isLoggedIn } from "../utils/identity"
import { Container } from 'semantic-ui-react';
import Steps from '../components/Steps';
class Layout extends Component {

	
	render() {
		return (
			<div className="pt-8 px-8 pb-8">
				<Header />
				{isLoggedIn() ? (<Container>
						<Steps {...this.props} />
					</Container>):('')}
				<div className="pt-8 px-8 pb-8">{this.props.children}</div>
			</div>
		);
	}
}

export { Layout };

//@ts-check
import React, { Component } from 'react';
import { Header } from './Header';
import '../css/style.css';
import { isLoggedIn } from "../utils/identity"
import { Container, Loader } from 'semantic-ui-react';
import Steps from '../components/Steps';
class Layout extends Component {

	
	render() {
		if (this.props.loading) {
			return <Loader active inline="centered" />;
		} else
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

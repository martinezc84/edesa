//@ts-check
import React, { Component } from 'react';
import { Header } from './Header';
import '../css/style.css';
class Layout extends Component {
	render() {
		return (
			<div>
				<Header />
				<div className="pt-8 px-8 pb-8">{this.props.children}</div>
			</div>
		);
	}
}

export { Layout };

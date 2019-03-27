//@ts-check
import React, { Component } from 'react';
import { Menu } from 'semantic-ui-react';
import { navigate } from 'gatsby';
import netlifyIdentity from 'netlify-identity-widget';
import '../css/style.css';
import SEO from './seo';
class Header extends Component {
	componentDidMount() {
		netlifyIdentity.init();
		netlifyIdentity.on('login', (user) => {
			navigate('/');
		});
		netlifyIdentity.on('logout', () => {
			navigate('/');
		});
	}

	onClick = (e, { path }) => {
		navigate(path);
	};
	
	render() {
		const user = netlifyIdentity.currentUser();
		let logged = !(user === null);
		return (
			<div>
				<SEO
					description="app"
					title="Gatsby-turnos"
					keywords={[ `gatsby`, `turnos`, `react`, `tailwindcss` ]}
				/>

				<Menu>
					<Menu.Item name="Inicio" path="/" onClick={this.onClick} />
					{logged ? (
						<React.Fragment>
							<Menu.Item name="app" path="/app" onClick={this.onClick} />
						</React.Fragment>
					) : null}

					<Menu.Menu position="right">
						{logged ? (
							<React.Fragment>
								<Menu.Item
									name="Log out"
									onClick={() => {
										netlifyIdentity.logout();
										navigate('/');
									}}
								/>
								<Menu.Item>{user ? user.email : ''}</Menu.Item>
							</React.Fragment>
						) : (
							<Menu.Item name="Login" onClick={() => netlifyIdentity.open()} />
						)}
					</Menu.Menu>
				</Menu>
			</div>
		);
	}
}

export { Header };

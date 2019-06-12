//@ts-check
import React from 'react';
//import netlifyIdentity from 'netlify-identity-widget';
import { isLoggedIn} from "../utils/identity"
import { navigate } from "gatsby"

const RutaPrivada = ({ component: Component,  ...rest }) => {

	if (!isLoggedIn() && location.pathname !== `/app/login/0`) {
		// If the user is not logged in, redirect to the login page.
		navigate(`/app/login/0`)
		return null
	  }
	

	return <Component {...rest} />;
};

export default RutaPrivada;

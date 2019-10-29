//@ts-check
import React from 'react';
import SweetAlert from 'react-bootstrap-sweetalert'

const Msjerror = ({ mensajes, titulo, visible, onConfirm }) => {
	return (
		<React.Fragment>
			{visible === true ? (
				<SweetAlert error title={titulo} onConfirm={() => {
					
					visible=false
					onConfirm();
			
				}}>
					
				{mensajes}
				</SweetAlert>
				) : null}
		</React.Fragment>
	);
};



export { Msjerror };

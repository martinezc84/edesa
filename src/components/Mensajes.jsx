//@ts-check
import React from 'react';
import SweetAlert from 'react-bootstrap-sweetalert'

const MostrarMensaje = ({ mensajes, titulo, visible, onConfirm }) => {
	return (
		<React.Fragment>
			{visible === true ? (
				<SweetAlert success title={titulo} onConfirm={() => {
					console.log('Boton presionado')
					visible=false
					onConfirm();
			
				}}>
					
				{mensajes}
				</SweetAlert>
				) : null}
		</React.Fragment>
	);
};



export { MostrarMensaje };

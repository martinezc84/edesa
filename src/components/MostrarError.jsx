//@ts-check
import React from 'react';
import PT from 'prop-types';
import { Message } from 'semantic-ui-react';

const MostrarError = ({ mensajes, visible }) => {
	return (
		<React.Fragment>
			{visible === true ? (
				<Message
					error
					header="Ocurrió un error al reasignar un turno. Envíe este detalle al administrador del sistema"
					list={mensajes}
				/>
			) : null}
		</React.Fragment>
	);
};

MostrarError.propTypes = {
	mensajes: PT.arrayOf(PT.string),
	visible: PT.bool.isRequired
};

export { MostrarError };

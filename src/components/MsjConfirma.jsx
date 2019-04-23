//@ts-check
import React from 'react';
import SweetAlert from 'react-bootstrap-sweetalert'

const MsjConfirma = ({ mensajes, titulo, visible, onConfirm, onCancel }) => {
	return (
		<React.Fragment>
			{visible === true ? (
				<SweetAlert
				warning
				showCancel
				confirmBtnText={titulo}
				confirmBtnBsStyle="danger"
				cancelBtnBsStyle="default"
				title="Esta seguro?"
				onConfirm={onConfirm}
				onCancel={onCancel}
				>
				{mensajes}
				</SweetAlert>
				) : null}
		</React.Fragment>
	);
};



export { MsjConfirma };

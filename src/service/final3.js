// //@ts-check
import axios from 'axios';
import { headers, URLS } from '../utils/utils';
import format from 'date-fns/format';
import subHours from 'date-fns/sub_hours';
import JSON from 'circular-json';

exports.handler = (event, context, callback) => {
	if (event.httpMethod !== 'POST') {
		return { statusCode: 405, body: 'Method Not Allowed!' };
	}

	let body = JSON.parse(event.body);
	const { agency_from_id, item_id, booked_quantity, temp_invoice_id } = body;
	let planned_delivery = format(subHours(new Date(), 6), 'YYYY-MM-DD');
	let data = {
		temp_invoice_id: temp_invoice_id.toString(),
		shipment: {
			reference: 'Reasignar otro turno',
			booker_id: '3867',
			needs_transport: '0',
			planned_delivery: planned_delivery.toString(),
			agency_from_id: agency_from_id.toString(),
			agency_to_id: '2502',
			movements_attributes: {
				'0': { item_id: item_id.toString(), booked_quantity: booked_quantity.toString() }
			},
			memo: 'Generado desde app de turnos'
		}
	};

	return axios
		.post(URLS.TRES, JSON.stringify(data), { headers: headers })
		.then((data) => {
			console.log({ response: JSON.stringify(data) });
			return {
				statusCode: 200,
				body: JSON.stringify(data)
			};
		})
		.catch((error) => ({
			statusCode: 422,
			body: `Oops! Something went wrong. ${error}`
		}));
};

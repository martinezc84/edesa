// @ts-check
import axios from 'axios';
import format from 'date-fns/format';
import subHours from 'date-fns/sub_hours';
import JSON from 'circular-json';
import { headers, URLS } from '../utils/utils';
exports.handler = async (event, context, callback) => {
	try {
		// Validar que se ha recibido un método POST
		if (event.httpMethod !== 'POST') {
			return { statusCode: 405, body: 'Method Not Allowed!' };
		}

		// Parse body recibido
		let body = JSON.parse(event.body);

		// Descontruir el body recibido
		let { data1, data3, data5 } = body;

		// Primer Llamada
		let { data: { id: id1 } } = await axios.post(URLS.UNO, JSON.stringify(data1), { headers: headers });
		console.log('Primer llamada exitosa');
		// Segunda Llamada
		let url2 = `${URLS.DOS_1}${id1}${URLS.DOS_2}`;
		let stat2 = await axios.get(url2, { headers: headers });
		console.log('Segunda llamada exitosa');

		// Tercer Llamada
		let { data: { id: id3 } } = await axios.post(URLS.TRES, JSON.stringify(data3), { headers: headers });
		console.log('Tercer llamada exitosa');

		// Cuarta Llamada
		let url4 = `${URLS.CUATRO_1}${id3}${URLS.CUATRO_2}`;
		let stat4 = await axios.get(url4, { headers: headers });
		console.log('Cuarta llamada exitosa');

		// Quinta Llamada
		let url5 = `${URLS.CINCO_1}${data5.inUrl}${URLS.CINCO_2}`;
		console.log('i5');
		console.log('');
		console.log({ url: url5 });
		console.log('');
		console.log({ data: JSON.stringify(data5.data) });
		console.log('');
		console.log('f5');
		let stat5 = await axios.put(url5, JSON.stringify(data5.data), { headers: headers });
		console.log('Quinta llamada exitosa');

		return {
			statusCode: 200,
			body: JSON.stringify({
				id1,
				id3,
				stat4,
				stat2,
				stat5,
				status: true
			})
		};
	} catch (error) {
		return {
			statusCode: 555,
			body: JSON.stringify({ message: 'error', status: false })
		};
	}
};

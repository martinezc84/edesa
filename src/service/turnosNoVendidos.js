//@ts-check
import axios from 'axios';
import { headers, URLS } from '../utils/utils';
const URL = URLS.turnosNoVendidos;

//@ts-ignore
exports.handler = async (event, context) => {
	try {
		//@ts-ignore
		const id = event.queryStringParameters.id;
		let url = `${URL}${id}`;
		console.log(url);
		let { data } = await axios.get(url, { headers });
		return {
			statusCode: 200,
			body: JSON.stringify(data)
		};
	} catch (error) {
		console.error(error);
		return {
			statusCode: 502,
			body: JSON.stringify(error)
		};
	}
};

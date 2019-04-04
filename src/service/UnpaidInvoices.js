//@ts-check
import axios from 'axios';
import { headers, URLS } from '../utils/utils';
const URL = URLS.UnpaidInvoices;

//@ts-ignore
exports.handler = async (event, context) => {
	try {
		//@ts-ignore
		
		let url = `${URL}`;
		let body = JSON.parse(event.body);
	    const { valor}  = body;

		let { data } = await axios.post(url, '{"draw":"1", "start":"0", "length":"40","search":{"value":"'+valor+'","regex":"false"}}' ,{ headers });
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

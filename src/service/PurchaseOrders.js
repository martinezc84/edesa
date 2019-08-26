//@ts-check
import axios from 'axios';
import { headers, URLS } from '../utils/utils';
const URL = URLS.PurchaseOrders;

const headersr = {
	'Access-Control-Allow-Origin': '*',
	'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
	'Content-Type': 'application/json',
	'Access-Control-Allow-Methods': '*',
	'Access-Control-Max-Age': '2592000',
	'Access-Control-Allow-Credentials': 'true',
  };

//@ts-ignore
exports.handler = async (event, context) => {
	try {
		//@ts-ignore
		
		let url = `${URL}`;
		let body = JSON.parse(event.body);
	    const { valor}  = body;

		let { data } = await axios.post(url, '{"draw":"1", "start":"0", "length":"45","search":{"value":"'+valor+'","regex":"false"},"order":{"0":{"column":3,"dir":"desc"}}}' ,{ headers });
		return {
			statusCode: 200,
			headers:headersr,
			body: JSON.stringify(data)
		};
	} catch (error) {
		console.error(error);
		return {
			statusCode: 502,
			headers:headersr,
			body: JSON.stringify(error)
		};
	}
};

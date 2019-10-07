//@ts-check
import axios from 'axios';
import { headers, URLS } from '../utils/utils';
import format from 'date-fns/format';
import subHours from 'date-fns/sub_hours';
import JSON from 'circular-json';

const headersr = {
	'Access-Control-Allow-Origin': '*',
	'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
	'Content-Type': 'application/json',
	'Access-Control-Allow-Methods': '*',
	'Access-Control-Max-Age': '2592000',
	'Access-Control-Allow-Credentials': 'true',
  };

exports.handler = (event, context, callback) => {
	if (event.httpMethod !== 'POST') {
		return { statusCode: 405, body: 'Method Not Allowed!' };
	}
	console.log(event.body);
	
	let URL = 'https://dcgse.com/calendario_api/apiprod/editarordenp';
	
	return axios
		.post(URL, event.body, { headers: headers })
		.then((data) => {
			console.log({ response: JSON.stringify(data.data) });
			return {
				statusCode: 200,
				body: JSON.stringify(data.data),
				headers:headersr,
			};
		})
		.catch((error) => ({
			statusCode: 422,
			body: `Oops! Something went wrong. ${error}`,
			headers:headersr,
		}));
};

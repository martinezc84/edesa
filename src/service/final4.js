// //@ts-check
import axios from 'axios';
import { headers, URLS } from '../utils/utils';
import JSON from 'circular-json';

exports.handler = (event, context, callback) => {
	if (event.httpMethod !== 'POST') {
		return { statusCode: 405, body: 'Method Not Allowed!' };
	}

	let body = JSON.parse(event.body);
	const { id } = body;
	let url = `${URLS.CUATRO_1}${id}${URLS.CUATRO_2}`;
	return axios
		.get(url, { headers: headers })
		.then(() => {
			return {
				statusCode: 200,
				body: JSON.stringify({ status: true })
			};
		})
		.catch((error) => ({
			statusCode: 422,
			body: `Oops! Something went wrong. ${error}`
		}));
};

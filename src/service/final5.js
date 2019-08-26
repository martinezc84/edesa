//@ts-check
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
	const { inUrl, data: postData } = body;
	let data = postData;
	let URL = `${URLS.CINCO_1}${inUrl}${URLS.CINCO_2}`;
	console.log({ URL, data });
	return axios
		.put(URL, JSON.stringify(data), { headers: headers })
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

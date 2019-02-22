import axios from 'axios';

export const turnos = async () => {
	try {
		const turnos = await axios.get(process.env.GATSBY_ZAURU_URL, { headers:{ 'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-User-Email': process.env.GATSBY_ZAURU_USER,
        'X-User-Token': process.env.GATSBY_ZAURU_TOKEN,} });
        console.log(turnos);
		return {
			statusCode: 200,
			body: JSON.stringify(turnos)
		};
	} catch (error) {	
        console.log(error);	
		return {
			statusCode: 502,
			body: JSON.stringify(error)
		};
	}
};
import axios from 'axios';

export const turnos = async () => {
	
		const turnos = await axios.get(process.env.GATSBY_ZAURU_URL, { headers:{ 'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-User-Email': process.env.GATSBY_ZAURU_USER,
        'X-User-Token': process.env.GATSBY_ZAURU_TOKEN,} });
        
		return JSON.parse(turnos)
	
};
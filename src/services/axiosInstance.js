import axios from 'axios';

// create an axios instance
const instance = axios.create({
	baseURL: 'http://localhost:4000/api',
});

export const requestOptions = (token) => {
	const options = {
		headers: {
			'Authorization': `Bearer ${token}`
		}
	};

	return options;
}

export const isTokenExpiredError = (error) => {
	const errorName = error?.response?.data?.error?.name?.toLowerCase() || '';
	const errorStatus = error?.response?.status;
	return errorName === 'tokenexpirederror' && errorStatus === 401;
}

export default instance;
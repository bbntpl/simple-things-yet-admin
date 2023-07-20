import axios from 'axios';

// create an axios instance
const instance = axios.create({
	baseURL: process.env.REACT_APP_API_URL,
});

export const requestOptions = (token, headersProps = {}) => {
	const headers = {
		...headersProps,
		'Authorization': `Bearer ${token}`
	}
	if (token) {
		headers['Authorization'] = `Bearer ${token}`;
	}
	const options = { headers };

	return options;
}

export const isTokenExpiredError = (error) => {
	const errorName = error?.response?.data?.error?.name?.toLowerCase() || '';
	const errorStatus = error?.response?.status;
	return errorName === 'tokenexpirederror' && errorStatus === 401;
}

export default instance;
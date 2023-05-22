import axiosInstance, {
	requestOptions
} from './axiosInstance';
const baseDirectory = '/author';

export const registerUser = async (data) => {
	try {
		const response = await axiosInstance.post(`${baseDirectory}/register`, data);
		return response.data;
	} catch (error) {
		console.log(`${error} (during author registration)`);
		if (error.response) {
			return error.response.data;
		}
	}
}

export const loginUser = async (data) => {
	try {
		const response = await axiosInstance.post(`${baseDirectory}/login`, data);
		return response.data;
	} catch (error) {
		console.log(`${error} (during author login)`);
		if (error.response) {
			return error.response.data;
		}
	}
}

export const updateAuthor = async (data, token) => {
	try {
		const response = await axiosInstance.put(
			`${baseDirectory}/update`,
			data,
			requestOptions(token)
		);
		return response.data;
	} catch (error) {
		console.log(error);
		throw new Error(`${error} (during author update)`);
	}
}

export const getUserAccount = async () => {
	try {
		const response = await axiosInstance.get(baseDirectory);
		return response.data;
	} catch (error) {
		throw new Error(`${error} (during author fetch)`);
	}
}
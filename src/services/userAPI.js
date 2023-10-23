import axiosInstance, {
	requestOptions
} from './axiosInstance';
import { fetchImageRequest, updateImageRequest } from './helper';
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
		throw new Error(`${error} (during author update)`);
	}
}

export const updateAuthorImage = async (file, token) => {
	try {
		return await updateImageRequest({
			file,
			token,
			formDataName: 'authorImage',
			endpoint: `${baseDirectory}/update/image`
		});
	} catch (error) {
		throw new Error(`${error} (during author image update)`);
	}
}

export const getUser = async () => {
	try {
		const response = await axiosInstance.get(baseDirectory);
		return response.data;
	} catch (error) {
		throw new Error(`${error} (during author fetch)`);
	}
}

export const fetchAuthorImageRequest = async (imageId) => {
	try {
		return await fetchImageRequest(`${baseDirectory}/${imageId}/image`);
	} catch (error) {
		throw new Error(`${error} (during author picture fetch by ID)`);
	}
}
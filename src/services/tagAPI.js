import axiosInstance, {
	requestOptions
} from './axiosInstance';
const baseDirectory = '/tags';

export const fetchTagsRequest = async () => {
	try {
		const response = await axiosInstance.get(`${baseDirectory}/`);
		return response.data;
	} catch (error) {
		throw new Error(`${error} (during tags fetch)`);
	}
}

export const fetchTagByIdRequest = async (tagId) => {
	try {
		const response = await axiosInstance.get(`${baseDirectory}/${tagId}`);
		return response.data;
	} catch (error) {
		throw new Error(`${error} (during tag fetch by ID)`);
	}
}

export const createTagRequest = async (tag, token) => {
	try {
		const response = await axiosInstance.post(
			`${baseDirectory}/`,
			tag,
			requestOptions(token)
		);
		return response.data;
	} catch (error) {
		if (error.response) {
			return error.response.data;
		} else {
			throw new Error(`${error} (during tag creation)`);
		}
	}
}

export const updateTagRequest = async (tagId, tag, token) => {
	try {
		const response = await axiosInstance.put(
			`${baseDirectory}/${tagId}`,
			tag,
			requestOptions(token)
		);
		return response.data;
	} catch (error) {
		if (error.response) {
			return error.response.data;
		} else {
			throw new Error(`${error} (during tag update)`);
		}
	}
}

export const deleteTagRequest = async (tagId, token) => {
	try {
		const response = await axiosInstance.delete(
			`${baseDirectory}/${tagId}`,
			requestOptions(token)
		);
		return response.data;
	} catch (error) {
		throw new Error(`${error} (during tag deletion)`);
	}
}
import axiosInstance, {
	requestOptions
} from './axiosInstance';
const baseDirectory = '/images';

export const fetchImageFileDocsRequest = async () => {
	try {
		const response = await axiosInstance.get(`${baseDirectory}/docs`);
		return response.data;
	} catch (error) {
		throw new Error(`${error.message} (during image file docs fetch)`);
	}
}

export const fetchImageFileDocRequest = async () => {
	try {
		const response = await axiosInstance.get(`${baseDirectory}/doc`);
		return response.data;
	} catch (error) {
		throw new Error(`${error.message} (during image file doc fetch)`);
	}
}


export const createImageFileDocRequest = async (creditData, token) => {
	try {
		const response = await axiosInstance.post(
			`${baseDirectory}/upload`,
			{ credit: creditData },
			requestOptions(token)
		);

		return response.data;
	} catch (error) {
		throw new Error(`${error.message} (during image file doc creation)`);
	}
}


export const updateImageFileDocRequest = async (data, token) => {
	const { body, imageId } = data;
	try {
		const response = await axiosInstance.put(
			`${baseDirectory}/${imageId}/update`,
			body,
			requestOptions(token)
		);

		return response.data;
	} catch (error) {
		throw new Error(`${error.message} (during image file doc update)`);
	}
}
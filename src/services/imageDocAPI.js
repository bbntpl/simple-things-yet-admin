import { removeEmptyProps } from '../helpers';
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

export const createImageFileDocRequest = async (args) => {
	const { file, credit, token } = args;
	try {
		const formData = new FormData();

		formData.append('credit', JSON.stringify(credit));
		formData.append('uploadImage', file);
		const response = await axiosInstance.post(
			`${baseDirectory}/upload`,
			formData,
			requestOptions(token, {
				'Content-Type': 'multipart/form-data'
			})
		);

		return response.data;
	} catch (error) {
		throw new Error(`${error.message} (during image file doc creation)`);
	}
}

export const updateImageFileDocRequest = async (args) => {
	const { credit, imageId, token } = args;
	try {
		const formData = new FormData();
		const trimmedCredit = removeEmptyProps(credit)
		formData.append('credit', JSON.stringify(trimmedCredit));

		const response = await axiosInstance.put(
			`${baseDirectory}/${imageId}/update`,
			{ credit: formData.get('credit') },
			requestOptions(token)
		);

		return response.data;
	} catch (error) {
		throw new Error(`${error.message} (during image file doc update)`);
	}
}

export const deleteImageFileDocRequest = async (imageId, token) => {
	try {
		const response = await axiosInstance.delete(
			`${baseDirectory}/${imageId}/doc`,
			requestOptions(token)
		);

		return response.data;
	} catch (error) {
		throw new Error(`${error.message} (during image file doc deletion)`);
	}
}
import { removeEmptyProps } from '../helpers';
import axiosInstance, {
	requestOptions
} from './axiosInstance';
import { fetchImageRequest, updateImageRequest } from './helper';
const baseDirectory = '/categories';

export const fetchCategoriesRequest = async () => {
	try {
		const response = await axiosInstance.get(`${baseDirectory}/`);
		return response.data;
	} catch (error) {
		throw new Error(`${error} (during categories fetch)`);
	}
}

export const fetchCategoryByIdRequest = async (categoryId) => {
	try {
		const response = await axiosInstance.get(`${baseDirectory}/${categoryId}`);
		return response.data;
	} catch (error) {
		throw new Error(`${error} (during category fetch by ID)`);
	}
}

export const fetchCategoryImageRequest = async (imageId) => {
	try {
		return await fetchImageRequest(`${baseDirectory}/${imageId}/image`);
	} catch (error) {
		throw new Error(`${error} (during category fetch by ID)`);
	}
}

export const createCategoryRequest = async (data, token) => {
	const { name, description, credit, file, existingImageId } = data;
	try {
		const formData = new FormData();
		formData.append('name', name);
		formData.append('description', description);
		formData.append('existingImageId', existingImageId || 'NULL');

		if (file) {
			const trimmedCredit = removeEmptyProps(credit);
			formData.append('credit', JSON.stringify(trimmedCredit));
			formData.append('categoryImage', file);
		}

		const response = await axiosInstance.post(
			`${baseDirectory}/`,
			formData,
			requestOptions(token)
		);

		return response.data;
	} catch (error) {
		if (error.response) {
			console.error(error.response.data);
			return error.response.data;
		} else {
			console.error(error);
			throw new Error(`${error} (during category creation)`);
		}
	}
}

export const updateCategoryImageRequest = async (args, token) => {
	const { file, existingImageId, categoryId, credit } = args;
	try {
		return await updateImageRequest({
			file,
			token,
			existingImageId,
			credit,
			formDataName: 'categoryImage',
			endpoint: `${baseDirectory}/${categoryId}/image`
		});
	} catch (error) {
		throw new Error(`${error} (during category image update)`);
	}
}

export const updateCategoryRequest = async (data, token) => {
	const { id, category } = data;
	try {
		const response = await axiosInstance.put(
			`${baseDirectory}/${id}`,
			category,
			requestOptions(token)
		);
		return response.data;
	} catch (error) {
		if (error.response) {
			console.error(error.response.data);
			return error.response.data;
		} else {
			console.error(error);
			throw new Error(`${error} (during category update)`);
		}
	}
}

export const deleteCategoryRequest = async (categoryId, token) => {
	try {
		const response = await axiosInstance.delete(
			`${baseDirectory}/${categoryId}`,
			requestOptions(token)
		);
		return response.data;
	} catch (error) {
		throw new Error(`${error} (during category deletion)`);
	}
}
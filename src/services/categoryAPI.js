import axiosInstance, {
	requestOptions
} from './axiosInstance';
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
		const response = await axiosInstance.get(`${baseDirectory}/image/${imageId}`);
		console.log(response);
		return response.data;
	} catch (error) {
		throw new Error(`${error} (during category fetch by ID)`);
	}
}

export const createCategoryRequest = async (category, token) => {
	try {
		const response = await axiosInstance.post(
			`${baseDirectory}/`,
			category,
			requestOptions(token)
		);
		return response.data;
	} catch (error) {
		if (error.response) {
			console.log(error.response.data);
			return error.response.data;
		} else {
			console.log(error);
			throw new Error(`${error} (during category creation)`);
		}
	}
}

export const updateCategoryRequest = async (categoryId, category, token) => {
	try {
		const response = await axiosInstance.put(
			`${baseDirectory}/${categoryId}`,
			category,
			requestOptions(token)
		);
		return response.data;
	} catch (error) {
		if (error.response) {
			console.log(error.response.data);
			return error.response.data;
		} else {
			console.log(error);
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
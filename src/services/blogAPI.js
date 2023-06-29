import axiosInstance, { requestOptions } from './axiosInstance';
const baseDirectory = '/blogs';

export const fetchBlogsRequest = async () => {
	try {
		const response = await axiosInstance.get(`${baseDirectory}/`);
		return response.data;
	} catch (error) {
		throw new Error(`${error} (during blogs fetch)`);
	}
}

export const fetchBlogByIdRequest = async (id) => {
	try {
		const response = await axiosInstance.get(`${baseDirectory}/${id}`);
		return response.data;
	} catch (error) {
		throw new Error(`${error} (during blog fetch by ID)`);
	}
}

export const createBlogRequest = async (args) => {
	const { blog, token, publishAction } = args;
	try {
		const response = await axiosInstance.post(
			`${baseDirectory}/${publishAction}`,
			blog,
			requestOptions(token));
		return response.data;
	} catch (error) {
		throw new Error(`${error} (during blog creation)`);
	}
}

export const updateBlogRequest = async (args) => {
	const { blogId, updatedBlog, token, publishAction } = args;
	try {
		const response = await axiosInstance.put(
			`${baseDirectory}/${blogId}/${publishAction}/authors-only`,
			updatedBlog,
			requestOptions(token));
		return response.data;
	} catch (error) {
		throw new Error(`${error} (during blog update)`);
	}
}

export const deleteBlogRequest = async (id, token) => {
	try {
		const response = await axiosInstance.delete(
			`${baseDirectory}/${id}`,
			requestOptions(token)
		);
		return response.data;
	} catch (error) {
		console.log(error);
		throw new Error(`${error} (during blog deletion)`);
	}
}
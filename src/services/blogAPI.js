const { axiosInstance, requestOptions } = require('./axiosInstance');
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

export const createBlogRequest = async (blog, token) => {
	try {
		const response = await axiosInstance.post(
			`${baseDirectory}/`,
			blog,
			requestOptions(token));
		return response.data;
	} catch (error) {
		throw new Error(`${error} (during blog creation)`);
	}
}

export const updateBlogRequest = async (blogId, updatedBlog, token) => {
	try {
		const response = await axiosInstance.put(
			`${baseDirectory}/${blogId}`,
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
		throw new Error(`${error} (during blog deletion)`);
	}
}
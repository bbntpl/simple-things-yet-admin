import axiosInstance, { requestOptions } from './axiosInstance';
import { fetchImageRequest, updateImageRequest } from './helper';
const baseDirectory = '/blogs';

export const fetchBlogsRequest = async () => {
	try {
		const response = await axiosInstance.get(`${baseDirectory}/`);
		return response.data;
	} catch (error) {
		throw new Error(`${error} (during blogs fetch)`);
	}
}

export const fetchBlogImageRequest = async (imageId) => {
	try {
		return await fetchImageRequest(`${baseDirectory}/${imageId}/image`);
	} catch (error) {
		throw new Error(`${error} (during blog image fetch)`);
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
	const { blog, token, publishAction, file } = args;
	try {
		const formData = new FormData();

		for (const key in blog) {
			if (blog.hasOwnProperty(key)) {
				if (Array.isArray(blog[key])) {
					blog[key].forEach(item => {
						formData.append(`${key}[]`, item);
					});
				} else {
					formData.append(key, blog[key]);
				}
			}
		}

		if (file) {
			formData.append('blogImage', file);
		}

		const response = await axiosInstance.post(
			`${baseDirectory}/${publishAction}`,
			formData,
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

export const updateBlogImageRequest = async (args) => {
	const { file, token, blogId } = args;
	try {
		return await updateImageRequest({
			file,
			token,
			formDataName: 'blogImage',
			endpoint: `${baseDirectory}/${blogId}/image-update/authors-only`
		});
	} catch (error) {
		throw new Error(`${error} (during blog image update)`);
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
		console.error(error);
		throw new Error(`${error} (during blog deletion)`);
	}
}

export const getBlogImageUrl = (imageId) => {
	return `${process.env.REACT_APP_API_URL}${baseDirectory}/${imageId}/image`;
};
import axiosInstance, { requestOptions } from './axiosInstance';

const baseURL = '/comments';

export const fetchAllCommentsRequest = async () => {
	try {
		const response = await axiosInstance.get(baseURL);
		return response.data;
	} catch (error) {
		throw new Error(`${error} (during comments fetch)`);
	}
}

export const fetchCommentByIdRequest = async (commentId) => {
	try {
		const response = await axiosInstance.get(`${baseURL}/${commentId}`);
		return response.data;
	} catch (error) {
		throw new Error(`${error} (during comment by ID fetch)`);
	}
}

export const fetchRepliesByCommentIdRequest = async (commentId) => {
	try {
		const response = await axiosInstance.get(`${baseURL}/${commentId}/replies`);
		return response.data
	} catch (error) {
		throw new Error(`${error} (during replies to a comment fetch)`);
	}
}

export const createAuthorCommentRequest = async (comment, token) => {
	try {
		const response = await axiosInstance.post(
			`${baseURL}/author-only`,
			comment,
			requestOptions(token)
		);
		return response.data;
	} catch (error) {
		throw new Error(`${error} (during author comment creation)`)
	}
}


export const updateAuthorCommentRequest = async (commentId, updatedComment, token) => {
	try {
		const response = await axiosInstance.put(
			`${baseURL}/${commentId}/author-only`,
			updatedComment,
			requestOptions(token)
		);
		return response.data;
	} catch (error) {
		throw new Error(`${error} (during author comment update)`)
	}
}


export const deleteAuthorCommentRequest = async (commentId, token) => {
	try {
		const response = await axiosInstance.delete(
			`${baseURL}/${commentId}/author-only`,
			requestOptions(token)
		);
		return response.data;
	} catch (error) {
		throw new Error(`${error} (during author comment deletion)`);
	}
}


export const createAuthorReplyRequest = async (parentCommentId, reply, token) => {
	try {
		const response = await axiosInstance.post(
			`${baseURL}/${parentCommentId}/author-only`,
			reply,
			requestOptions(token)
		);
		return response.data;
	} catch (error) {
		throw new Error(`${error} (during author reply creation)`)
	}
}


export const updateAuthorReplyRequest = async (parentCommentId, replyId, updatedReply, token) => {
	try {
		const response = await axiosInstance.put(
			`${baseURL}/${parentCommentId}/replies/${replyId}/author-only`,
			updatedReply,
			requestOptions(token)
		);
		return response.data;
	} catch (error) {
		throw new Error(`${error} (during author reply update)`)
	}
}


export const deleteAuthorReplyRequest = async (parentCommentId, replyId, token) => {
	try {
		const response = await axiosInstance.delete(
			`${baseURL}/${parentCommentId}/replies/${replyId}/author-only`,
			requestOptions(token)
		);
		return response.data;
	} catch (error) {
		throw new Error(`${error} (during author reply deletion)`);
	}
}
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
	fetchAllCommentsRequest,
	fetchCommentByIdRequest,
} from '../../services/commentAPI';

export const fetchAllComments = createAsyncThunk(
	'comments/fetchAllComments',
	async () => {
		return await fetchAllCommentsRequest();
	}
);

export const fetchCommentById = createAsyncThunk(
	'comments/fetchCommentById',
	async (commentId) => {
		return await fetchCommentByIdRequest(commentId);
	}
);

// other thunks similar to fetchCommentByIdAsync

const initialState = [];

const commentsSlice = createSlice({
	name: 'comments',
	initialState,
	reducers: {
		createAuthorComment: (state, action) => {
			state.push(action.payload);
		},
		removeAuthorComment: (state, action) => {
			return state.filter(comment => comment.id !== action.payload);
		},
		updateAuthorComment: (state, action) => {
			const index = state.findIndex(comment => comment.id === action.payload.id);
			if (index !== -1) {
				state[index] = action.payload;
			}
		},
		createAuthorReply: (state, action) => {
			const comment = state.find(comment => comment.id === action.payload.commentId);
			if (comment) {
				if (!comment.replies) {
					comment.replies = [];
				}
				comment.replies.push(action.payload.reply);
			}
		},
		updateAuthorReply: (state, action) => {
			const comment = state.find(comment => comment.id === action.payload.commentId);
			if (comment && comment.replies) {
				const index = comment.replies.findIndex(reply => reply.id === action.payload.replyId);
				if (index !== -1) {
					comment.replies[index] = action.payload.updatedReply;
				}
			}
		},
		deleteAuthorReply: (state, action) => {
			const comment = state.find(comment => comment.id === action.payload.commentId);
			if (comment && comment.replies) {
				comment.replies = comment.replies.filter(reply => reply.id !== action.payload.replyId);
			}
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(fetchAllComments.fulfilled, (state, action) => {
				return action.payload;
			})
			.addCase(fetchCommentById.fulfilled, (state, action) => {
				return [action.payload];
			});
	}
});

export const selectComments = (state) => {
	return state.comments;
}

export function selectComment(commentId) {
	return (state) => {
		return state.comments.find(comment => comment.id === commentId);
	}
}

export function selectReplies(commentId) {
	return (state) => {
		const comment = state.comments.find(comment => comment.id === commentId);
		return comment.replies || [];
	}
}

export const {
	createAuthorComment,
	updateAuthorComment,
	deleteAuthorComment,
	createAuthorReply,
	updateAuthorReply,
	deleteAuthorReply
} = commentsSlice.actions;

export default commentsSlice.reducer;

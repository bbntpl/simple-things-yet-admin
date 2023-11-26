import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { fetchBlogsRequest } from '../../services/blogAPI';

const initialState = {
	data: [],
	status: 'idle',
}

const blogsSlice = createSlice({
	name: 'blogs',
	initialState,
	reducers: {
		blogAdded(state, action) {
			state.data.push(action.payload)
		},
		blogDeleted(state, action) {
			state.data = state.data.filter(blog => blog.id !== action.payload);
		},
		blogUpdated(state, action) {
			const index = state.data.findIndex(blog => blog.id === action.payload.id);
			if (index > -1) {
				state.data[index] = action.payload;
			}
		}
	},
	extraReducers: (builder) => {
		builder
			.addCase(initializeBlogs.pending, (state, _) => {
				state.status = 'loading';
			})
			.addCase(initializeBlogs.fulfilled, (state, action) => {
				state.status = 'succeeded';
				state.data = action.payload
			})
	},
});

export const initializeBlogs = createAsyncThunk('blogs/initializeBlogs',
	async () => {
		const response = await fetchBlogsRequest();
		return response;
	})

export const selectPublishedBlogs = (state) => state.blogs.data.filter(blog => blog.isPublished);
export const selectDrafts = (state) => state.blogs.data.filter(blog => !blog.isPublished);
export const selectBlogs = (state) => state.blogs.data;
export const selectBlogsWithTag = (tagId) => (state) => {
	if (!tagId) return;
	return state.blogs.data.filter(blog => blog.tags.includes(tagId));
}
export const selectBlogsWithCategory = (catId) => (state) => {
	return state.blogs.data.filter(blog => blog.category === catId);
}

export const {
	blogAdded,
	blogDeleted,
	blogUpdated
} = blogsSlice.actions;

export default blogsSlice.reducer;
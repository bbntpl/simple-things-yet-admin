import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { fetchBlogsRequest } from '../../services/blogAPI';


const initialState = {
	blogs: [],
	status: 'idle',
	error: null
}

export const initializeBlogs = createAsyncThunk('blogs/initializeBlogs',
	async () => {
		const response = await fetchBlogsRequest();
		return response;
	})

const blogsSlice = createSlice({
	name: 'blogs',
	initialState,
	reducers: {
		blogAdded(state, action) {
			state.blogs.push(action.payload)
		},
		blogDeleted(state, action) {
			state.blogs = state.blogs.filter(blog => blog.id !== action.payload);
		},
		blogUpdated(state, action) {
			const index = state.blogs.findIndex(blog => blog.id === action.payload.id);
			if (index > -1) {
				state.blogs[index] = action.payload;
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
				state.blogs = action.payload
			})
			.addCase(initializeBlogs.rejected, (state, action) => {
				state.status = 'failed';
				state.error = action.error.message;
			})
	},
});

export const selectPublishedBlogs = (state) => state.blogs.blogs.filter(blog => blog.isPublished);
export const selectDrafts = (state) => state.blogs.blogs.filter(blog => !blog.isPublished);
export const selectBlogs = (state) => state.blogs.blogs;
export const selectBlogsWithTag = (tagId) => (state) => {
	if (!tagId) return;
	return state.blogs.blogs.filter(blog => blog.tags.includes(tagId));
}
export const selectBlogsWithCategory = (catId) => (state) => {
	return state.blogs.blogs.filter(blog => blog.category === catId);
}

export const {
	blogAdded,
	blogDeleted,
	blogUpdated
} = blogsSlice.actions;

export default blogsSlice.reducer;
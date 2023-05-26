import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { fetchBlogsRequest } from '../../services/blogAPI';

export const initializeBlogs = createAsyncThunk('blogs/initializeBlogs',
	async () => {
		const response = await fetchBlogsRequest();
		return response;
	})

const blogsSlice = createSlice({
	name: 'blogs',
	initialState: [],
	reducers: {
		createBlogReducer(state, action) {
			state.push(action.payload)
		},
		deleteBlogReducer(state, action) {
			return state.filter(blog => blog.id !== action.payload);
		},
		updateBlogReducer(state, action) {
			const index = state.findIndex(blog => blog.id === action.payload.id);
			if (index > -1) {
				state[index] = action.payload;
			}
		}
	},
	extraReducers: (builder) => {
		builder.addCase(initializeBlogs.fulfilled, (_, action) => {
			return action.payload;
		})
	},
});

export const selectBlogs = (state) => state.blogs;
export const {
	createBlogReducer,
	deleteBlogReducer,
	updateBlogReducer
} = blogsSlice.actions;

export default blogsSlice.reducer;
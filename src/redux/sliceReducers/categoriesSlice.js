import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchCategoriesRequest } from '../../services/categoryAPI';

const initialState = {
	status: 'idle',
	categories: [],
	error: null
}

export const fetchCategories = createAsyncThunk('categories/fetchCategories',
	async () => {
		const response = await fetchCategoriesRequest();
		return response;
	});

const categoriesSlice = createSlice({
	name: 'categories',
	initialState,
	reducers: {
		categoryAdded(state, action) {
			state.categories.push(action.payload)
		},
		categoryDeleted(state, action) {
			state.categories = state.categories.filter(category => category.id !== action.payload);
		},
		categoryUpdated(state, action) {
			const index = state.categories.findIndex(category => category.id === action.payload.id);
			if (index > -1) {
				state.categories[index] = action.payload;
			}
		}
	},
	extraReducers: (builder) => {
		builder
			.addCase(fetchCategories.pending, (state, _) => {
				state.status = 'loading'
			})
			.addCase(fetchCategories.fulfilled, (state, action) => {
				state.status = 'succeeded';
				state.categories = action.payload
			})
			.addCase(fetchCategories.rejected, (state, action) => {
				state.status = 'failed';
				state.error = action.error.message;
			})
	},
});
export const selectCategory = (slug) => (state) =>
	state.categories.categories.find(cat => cat.slug === slug) || null;
export const selectCategories = (state) => state.categories.categories;

export const {
	categoryAdded,
	categoryDeleted,
	categoryUpdated
} = categoriesSlice.actions;

export default categoriesSlice.reducer;
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchCategoriesRequest } from '../../services/categoryAPI';

export const fetchCategories = createAsyncThunk('categories/fetchCategories',
	async () => {
		const response = await fetchCategoriesRequest();
		return response;
	});

const categoriesSlice = createSlice({
	name: 'categories',
	initialState: [],
	reducers: {
		createCategoryReducer(state, action) {
			state.push(action.payload)
		},
		deleteCategoryReducer(state, action) {
			return state.filter(category => category.id !== action.payload);
		},
		updateCategoryReducer(state, action) {
			const index = state.findIndex(category => category.id === action.payload.id);
			if (index > -1) {
				state[index] = action.payload;
			}
		}
	},
	extraReducers: (builder) => {
		builder.addCase(fetchCategories.fulfilled, (state, action) => {
			return action.payload;
		});
	},
});
export const selectCategory = (name) => (state) =>
	state.categories.find(cat => cat.name === name) || null;
export const selectCategories = (state) => state.categories;
export const {
	createCategoryReducer,
	deleteCategoryReducer,
	updateCategoryReducer
} = categoriesSlice.actions;

export default categoriesSlice.reducer;
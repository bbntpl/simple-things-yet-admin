import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchTagsRequest } from '../../services/tagAPI';

export const fetchTags = createAsyncThunk('tags/fetchTags',
	async () => {
		const response = await fetchTagsRequest();
		return response;
	});

const tagsSlice = createSlice({
	name: 'tags',
	initialState: [],
	reducers: {
		createTagReducer(state, action) {
			state.push(action.payload)
		},
		deleteTagReducer(state, action) {
			return state.filter(tag => tag.id !== action.payload);
		},
		updateTagReducer(state, action) {
			const index = state.findIndex(tag => tag.id === action.payload.id);
			if (index > -1) {
				state[index] = action.payload;
			}
		}
	},
	extraReducers: (builder) => {
		builder.addCase(fetchTags.fulfilled, (state, action) => {
			return action.payload;
		});
	},
});
export const selectTag = (slug) => (state) =>
	state.tags.find(tag => tag.slug === slug) || null;
export const selectTags = (state) => state.tags;
export const {
	createTagReducer,
	deleteTagReducer,
	updateTagReducer
} = tagsSlice.actions;

export default tagsSlice.reducer;
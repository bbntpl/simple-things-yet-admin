
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchImageFileDocRequest, fetchImageFileDocsRequest } from '../../services/imageDocAPI';

const initialState = {
	status: 'idle',
	data: [],
}

const imageDocsSlice = createSlice({
	name: 'imageDocs',
	initialState,
	reducers: {
		imageDocAdded(state, action) {
			state.data = [...(new Set([...state.data, action.payload]))]
		},
		imageDocDeleted(state, action) {
			state.data = state.data.filter(imageDoc => imageDoc.id !== action.payload);
		},
		imageDocUpdated(state, action) {
			const index = state.data.findIndex(imageDoc => imageDoc.id === action.payload.id);
			if (index > -1) {
				state.data[index] = action.payload;
			}
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(fetchImageDocs.pending, (state, _) => {
				state.status = 'loading'
			})
			.addCase(fetchImageDocs.fulfilled, (state, action) => {
				state.status = 'succeeded';
				state.data = action.payload;
			})
			.addCase(fetchImageDocById.pending, (state) => {
				state.status = 'loading';
			})
			.addCase(fetchImageDocById.fulfilled, (state, action) => {
				state.status = 'succeeded';
				state.data = [...state.data, action.payload];
			});
	},
});

export const fetchImageDocs = createAsyncThunk('imageDocs/fetchImageDocs',
	async () => {
		const response = await fetchImageFileDocsRequest();
		return response;
	});

export const fetchImageDocById = createAsyncThunk('imageDocs/fetchImageDocById',
	async (id) => {
		const response = await fetchImageFileDocRequest(id);
		return response;
	})

export const selectImageDoc = (id) => (state) =>
	state.imageDocs.data.find(doc => doc.id === id) || null;
export const selectImageDocs = (state) => state.imageDocs.data;

export const {
	imageDocAdded,
	imageDocDeleted,
	imageDocUpdated,
} = imageDocsSlice.actions;

export default imageDocsSlice.reducer;
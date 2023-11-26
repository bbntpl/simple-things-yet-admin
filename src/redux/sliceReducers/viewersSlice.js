import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { fetchAllViewers } from '../../services/viewerAPI';

const initialState = {
	blogs: [],
	status: 'idle',
}

const viewersSlice = createSlice({
	name: 'viewers',
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder.addCase(initializeViewers.fulfilled, (state, action) => {
			state.data = action.payload;
		})
	}
});

export const initializeViewers = createAsyncThunk(
	'viewers/initializeViewers',
	async () => {
		const response = await fetchAllViewers();
		return response;
	}
)

export function selectViewer(viewerId) {
	return (state) => {
		return state.viewers.find(viewer => viewer.id === viewerId);
	}
}

export function selectViewers(state) {
	return state.viewers;
}

export default viewersSlice.reducer;
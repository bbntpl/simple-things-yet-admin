import { createSlice } from '@reduxjs/toolkit';

const initialState = [];

const commentsSlice = createSlice({
	name: 'comments',
	initialState,
	reducers: {}
});

export default commentsSlice.reducer;
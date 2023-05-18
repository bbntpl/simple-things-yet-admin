import { createSlice } from '@reduxjs/toolkit';

const initialState = [];

const blogsSlice = createSlice({
	name: 'blogs',
	initialState,
	reducers: {}
});

export default blogsSlice.reducer;
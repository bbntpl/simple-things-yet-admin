import { createSlice } from '@reduxjs/toolkit';
import LS from '../../helpers/local-storage';

const loggedAuthorJSON = LS.getItem('loggedAuthor');
const initialState = loggedAuthorJSON || { credentials: null, info: null };

const loggedAuthorSlice = createSlice({
	name: 'loggedAuthor',
	initialState,
	reducers: {
		logoutAuthor() {
			LS.removeItem('loggedAuthor');
			return { credentials: null, info: null };
		},
		loginAuthor(state, action) {
			const { credentials } = action.payload;
			const updatedState = { ...state, credentials };
			LS.setItem('loggedAuthor', updatedState);
			return updatedState;
		},
		updateAuthorInfo(state, action) {
			const { info } = action.payload;
			const updatedState = { ...state, info };
			LS.setItem('loggedAuthor', updatedState);
			return updatedState;
		},
	}
});

export const selectLoggedAuthor = (state) => state.loggedAuthor.credentials;
export const selectToken = (state) => state.loggedAuthor.credentials?.token;
export const selectAuthorInfo = (state) => state.loggedAuthor.info;
export const {
	logoutAuthor,
	loginAuthor,
	updateAuthorInfo
} = loggedAuthorSlice.actions;

export default loggedAuthorSlice.reducer;
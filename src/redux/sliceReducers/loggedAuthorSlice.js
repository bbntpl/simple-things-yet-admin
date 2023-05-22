import { createSlice } from '@reduxjs/toolkit';
import LS from '../../utils/localStorage';

const loggedAuthorJSON = LS.getItem('loggedAuthor');
const initialState = loggedAuthorJSON || null;

const loggedAuthorSlice = createSlice({
	name: 'loggedAuthor',
	initialState,
	reducers: {
		logoutAuthor() {
			LS.removeItem('loggedAuthor');
			return null;
		},
		loginAuthor(state, action) {
			return action.payload;
		}
	}
});

export const selectLoggedAuthor = (state) => state.loggedAuthor;
export const selectToken = (state) => state.loggedAuthor.token;
export const {
	logoutAuthor,
	loginAuthor
} = loggedAuthorSlice.actions;
export default loggedAuthorSlice.reducer;
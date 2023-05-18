import { createSlice } from '@reduxjs/toolkit';
import LS from '../../utils/localStorage';

const loggedAuthorJSON = LS.getItem('loggedAuthor');
const initialState = loggedAuthorJSON || null;

const loggedAuthorSlice = createSlice({
	name: 'loggedAuthor',
	initialState,
	reducers: {
		logoutAuthor(state) {
			LS.removeItem('loggedAuthor');
			return null;
		},
		loginAuthor(state, action) {
			return action.payload;
		}
	}
});

export const selectLoggedAuthor = (state) => state.loggedAuthor;
export const {
	logoutAuthor,
	loginAuthor
} = loggedAuthorSlice.actions;
export default loggedAuthorSlice.reducer;
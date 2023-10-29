import { configureStore } from '@reduxjs/toolkit';

import blogsSlice from './sliceReducers/blogsSlice';
import categoriesSlice from './sliceReducers/categoriesSlice';
import commentsSlice from './sliceReducers/commentsSlice';
import loggedAuthorSlice from './sliceReducers/loggedAuthorSlice';
import viewersSlice from './sliceReducers/viewersSlice';
import tagsSlice from './sliceReducers/tagsSlice';
import imageDocsSlice from './sliceReducers/imageDocsSlice';

const store = configureStore({
	reducer: {
		blogs: blogsSlice,
		categories: categoriesSlice,
		comments: commentsSlice,
		loggedAuthor: loggedAuthorSlice,
		tags: tagsSlice,
		viewers: viewersSlice,
		imageDocs: imageDocsSlice
	}
})

export default store
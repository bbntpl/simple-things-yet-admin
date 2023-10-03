import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchTagsRequest } from '../../services/tagAPI';

const initialState = {
	tags: [],
	status: 'idle',
	error: null
}

export const fetchTags = createAsyncThunk('tags/fetchTags',
	async () => {
		const response = await fetchTagsRequest();
		return response;
	});

const tagsSlice = createSlice({
	name: 'tags',
	initialState,
	reducers: {
		tagAdded(state, action) {
			state.tags.push(action.payload)
		},
		tagDeleted(state, action) {
			state.tags = state.tags.filter(tag => tag.id !== action.payload);
		},
		tagUpdated(state, action) {
			const index = state.tags.findIndex(tag => tag.id === action.payload.id);
			if (index > -1) {
				state.tags[index] = action.payload;
			}
		},
		tagBlogsUpdated(state, action) {
			const { tagIds, blogId } = action.payload;

			tagIds.forEach(tagId => {
				const tag = state.tags.find(t => t.id === tagId);

				if (tag) {
					// If it exists, it means the blog got deleted; otherwise, it got added
					const isBlogExisted = tag.blogs.some(blog => blog === blogId);

					// If the blog exists in the tag, remove it
					if (isBlogExisted) {
						tag.blogs = tag.blogs.filter(blog => blog !== blogId);
					} else {
						// Otherwise, add the new blog to the tag
						tag.blogs.push(blogId);
					}
				}
			});
		}
	},
	extraReducers: (builder) => {
		builder
			.addCase(fetchTags.pending, (state, _) => {
				state.status = 'loading'
			})
			.addCase(fetchTags.fulfilled, (state, action) => {
				state.status = 'succeeded';
				state.tags = action.payload
			})
			.addCase(fetchTags.rejected, (state, action) => {
				state.status = 'failed';
				state.error = action.error.message;
			})
	},
});
export const selectTag = (slug) => (state) => {
	return state.tags.tags.find(tag => tag.slug === slug) || null;
}
export const selectTags = (state) => state.tags.tags;
export const {
	tagAdded,
	tagDeleted,
	tagUpdated,
	tagBlogsUpdated
} = tagsSlice.actions;

export default tagsSlice.reducer;
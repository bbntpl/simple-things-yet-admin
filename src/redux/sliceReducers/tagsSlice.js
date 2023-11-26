import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchTagsRequest } from '../../services/tagAPI';

const initialState = {
	data: [],
	status: 'idle',
}

const tagsSlice = createSlice({
	name: 'tags',
	initialState,
	reducers: {
		tagAdded(state, action) {
			state.data = [...(new Set([...state.data, action.payload]))]
		},
		tagDeleted(state, action) {
			state.data = state.data.filter(tag => tag.id !== action.payload);
		},
		tagUpdated(state, action) {
			const index = state.data.findIndex(tag => tag.id === action.payload.id);
			if (index > -1) {
				state.data[index] = action.payload;
			}
		},
		tagBlogsUpdated(state, action) {
			const { tagIds, blogId } = action.payload;

			tagIds.forEach(tagId => {
				const tag = state.data.find(t => t.id === tagId);

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
				state.data = action.payload
			})
	},
});

export const fetchTags = createAsyncThunk('tags/fetchTags',
	async () => {
		const response = await fetchTagsRequest();
		return response;
	});

export const selectTag = (slug) => (state) => {
	return state.tags.data.find(tag => tag.slug === slug) || null;
}
export const selectTags = (state) => state.tags.data;

export const {
	tagAdded,
	tagDeleted,
	tagUpdated,
	tagBlogsUpdated
} = tagsSlice.actions;

export default tagsSlice.reducer;
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Layout, Spin } from 'antd';
import { useEffect, useState } from 'react';

import BlogList from '../../components/Blog/BlogList';

import { updateTagRequest } from '../../services/tagAPI';
import { fetchTags, selectTag, updateTagReducer } from '../../redux/sliceReducers/tagsSlice';
import { selectToken } from '../../redux/sliceReducers/loggedAuthorSlice';
import { initializeBlogs, selectBlogs } from '../../redux/sliceReducers/blogsSlice';
import Title from 'antd/es/typography/Title';

export default function BlogsPageByTag() {
	const { tagSlug } = useParams();
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const authorToken = useSelector(selectToken);
	const tag = useSelector(selectTag(tagSlug));
	const publishedBlogs = useSelector(selectBlogs).filter(blog => blog?.isPublished);
	const [blogsByTag, setBlogsByTag] = useState(null);

	useEffect(() => {
		if (!tag) {
			dispatch(fetchTags());
		}
		if (tag) {
			dispatch(initializeBlogs());
		}
	}, [dispatch, tag])


	useEffect(() => {
		if (tag && publishedBlogs) {
			const filteredBlogs = publishedBlogs.filter(blog => tag.blogs.includes(blog.id));
			// Bookmarked: This does not have sufficient dependencies and cannot add publishedBlogs as it'll
			// cause infinite loops
			setBlogsByTag(filteredBlogs);
		}
	}, [tag])

	const handleTagUpdate = async (tagName) => {
		if (tagName !== tag.name) {
			updateTagRequest(tag.id, { ...tag, name: tagName }, authorToken)
				.then(result => {
					if (result?.error) return;
					dispatch(updateTagReducer(result));
					navigate(`/tag/${result.slug}`);
				})
				.catch(err => {
					console.log(err);
				})
		}
	}

	if (!blogsByTag) {
		return <Spin />
	}

	if (!tag) {
		return <div>This tag does not exist.</div>
	}

	return <Layout>
		<Title level={1} editable={{ onChange: handleTagUpdate }}>
			{tag.name}
		</Title>
		<BlogList
			headerText={`Blogs under tag ${tag.name}`}
			blogs={blogsByTag}
		/>
	</Layout>
}
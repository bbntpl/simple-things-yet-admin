import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Spin, Layout } from 'antd';

import { initializeBlogs, selectPublishedBlogs } from '../../redux/sliceReducers/blogsSlice';
import { fetchTags, selectTags } from '../../redux/sliceReducers/tagsSlice';
import BlogList from '../../components/Blog/BlogList';
import TagsCollapse from '../../components/Tag/TagsCollapse';

function BlogsPage() {
	const dispatch = useDispatch()
	const publishedBlogs = useSelector(selectPublishedBlogs);
	const blogStatus = useSelector(state => state.blogs.status);
	const tagStatus = useSelector(state => state.tags.status);
	const tags = useSelector(selectTags);

	useEffect(() => {
		if (blogStatus === 'idle') {
			dispatch(initializeBlogs());
		}
		if (tagStatus === 'idle') {
			dispatch(fetchTags());
		}
	}, [blogStatus, dispatch, tagStatus])

	if (blogStatus !== 'succeeded' || tagStatus !== 'succeeded') {
		return <Spin />
	}

	return <Layout>
		<TagsCollapse collapseSize='large' headerName='Tags' tags={tags} />
		<BlogList headerText='Your Blogs' blogs={publishedBlogs} />
	</Layout>
}

export default BlogsPage;
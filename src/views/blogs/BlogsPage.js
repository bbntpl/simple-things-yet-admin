import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Spin, Collapse, Layout } from 'antd';

import { initializeBlogs, selectPublishedBlogs } from '../../redux/sliceReducers/blogsSlice';
import { fetchTags, selectTags } from '../../redux/sliceReducers/tagsSlice';
import BlogList from '../../components/Blog/BlogList';
import TagItemList from '../../components/Tag/TagItemList';

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
		<Collapse size='large'>
			<Collapse.Panel header={'Tags'}>
				<TagItemList tags={tags} />
			</Collapse.Panel>
		</Collapse>
		<BlogList headerText='Your Blogs' blogs={publishedBlogs} />
	</Layout>
}

export default BlogsPage;
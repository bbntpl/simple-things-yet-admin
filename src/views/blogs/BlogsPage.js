import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Spin, Collapse, Layout } from 'antd';

import { initializeBlogs, selectBlogs } from '../../redux/sliceReducers/blogsSlice';
import BlogList from '../../components/Blog/BlogList';
import { fetchTags, selectTags } from '../../redux/sliceReducers/tagsSlice';
import TagItemList from '../../components/Tag/TagItemList';

function BlogsPage() {
	const dispatch = useDispatch()
	const blogs = useSelector(selectBlogs).filter(blog => blog.isPublished) || null;
	const tags = useSelector(selectTags) || null;

	useEffect(() => {
		dispatch(initializeBlogs());
		dispatch(fetchTags());
	}, [dispatch])

	if (!Array.isArray(blogs) && !Array.isArray(tags)) {
		return <Spin />
	}

	return <Layout>
		<Collapse size='large'>
			<Collapse.Panel header={'Tags'}>
				<TagItemList tags={tags} />
			</Collapse.Panel>
		</Collapse>
		<BlogList headerText='Your Blogs' blogs={blogs} />
	</Layout>
}

export default BlogsPage;
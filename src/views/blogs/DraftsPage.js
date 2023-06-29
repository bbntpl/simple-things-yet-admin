import { useDispatch, useSelector } from 'react-redux';
import { Layout, Spin } from 'antd';
import { useEffect } from 'react';

import BlogList from '../../components/Blog/BlogList';
import { fetchCategories } from '../../redux/sliceReducers/categoriesSlice';
import { initializeBlogs, selectBlogs } from '../../redux/sliceReducers/blogsSlice';

function DraftsPage() {
	const dispatch = useDispatch();
	const savedDrafts = useSelector(selectBlogs).filter(blog => !blog.isPublished) || null;

	useEffect(() => {
		dispatch(initializeBlogs());
		dispatch(fetchCategories());
	}, [dispatch])

	if (!Array.isArray(savedDrafts)) {
		return <Spin />
	}

	return <Layout>
		<BlogList headerText='Unpublished blogs' blogs={savedDrafts} />
	</Layout>
}

export default DraftsPage;
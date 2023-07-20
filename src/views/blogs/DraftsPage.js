import { useDispatch, useSelector } from 'react-redux';
import { Layout, Spin } from 'antd';
import { useEffect } from 'react';

import BlogList from '../../components/Blog/BlogList';
import { fetchCategories } from '../../redux/sliceReducers/categoriesSlice';
import { initializeBlogs, selectDrafts } from '../../redux/sliceReducers/blogsSlice';

function DraftsPage() {
	const dispatch = useDispatch();
	const blogStatus = useSelector(state => state.blogs.status);
	const categoryStatus = useSelector(state => state.categories.status);
	const savedDrafts = useSelector(selectDrafts);

	useEffect(() => {
		if (blogStatus === 'idle') {
			dispatch(initializeBlogs());
		}
		if (categoryStatus === 'idle') {
			dispatch(fetchCategories());
		}
	}, [blogStatus, categoryStatus, dispatch])

	if (blogStatus !== 'succeeded') {
		return <Spin />
	}

	return <Layout>
		<BlogList headerText='Unpublished blogs' blogs={savedDrafts} />
	</Layout>
}

export default DraftsPage;
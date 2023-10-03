import { useDispatch, useSelector } from 'react-redux';
import { Layout, Spin } from 'antd';
import { useEffect } from 'react';

import TagsCollapse from '../../components/Tag/TagsCollapse';
import BlogList from '../../components/Blog/BlogList';

import { fetchCategories } from '../../redux/sliceReducers/categoriesSlice';
import { initializeBlogs, selectDrafts } from '../../redux/sliceReducers/blogsSlice';
import { selectTags } from '../../redux/sliceReducers/tagsSlice';

function DraftsPage() {
	const dispatch = useDispatch();
	const blogStatus = useSelector(state => state.blogs.status);
	const categoryStatus = useSelector(state => state.categories.status);
	const savedDrafts = useSelector(selectDrafts);
	const tags = useSelector(selectTags);

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
		<TagsCollapse collapseSize='large' headerName='Tags' tags={tags} />
		<BlogList headerText='Unpublished blogs' blogs={savedDrafts} />
	</Layout>
}

export default DraftsPage;
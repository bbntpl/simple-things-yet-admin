import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Spin, Collapse, Divider } from 'antd';

import { initializeBlogs, selectBlogs } from '../../redux/sliceReducers/blogsSlice';
import { selectCategories } from '../../redux/sliceReducers/categoriesSlice';
import CategoryItemList from '../../components/Category/CategoryItemList';
import { fetchCategories } from '../../redux/sliceReducers/categoriesSlice';
import BlogList from '../../components/Blog/BlogList';


function BlogsPage() {
	const dispatch = useDispatch()
	const blogs = useSelector(selectBlogs) || null;
	const categories = useSelector(selectCategories) || null;

	useEffect(() => {
		dispatch(initializeBlogs());
		dispatch(fetchCategories());
	}, [dispatch])
	if (!Array.isArray(blogs) && !Array.isArray(categories)) {
		return <Spin />
	}
	return <div>
		<Divider orientation='left'>Blog Categories</Divider>
		<Collapse size='large'>
			<Collapse.Panel header={'Categories'}>
				<CategoryItemList categories={categories} />
			</Collapse.Panel>
		</Collapse>
		<BlogList headerText='Recent Blogs' blogs={blogs} />
	</div>
}

export default BlogsPage;
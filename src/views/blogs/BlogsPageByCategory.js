import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Divider, Form, Layout, Spin } from 'antd';
import { useEffect, useState } from 'react';

import CategoryForm from '../../components/Category/CategoryForm';
import BlogList from '../../components/Blog/BlogList';
import openNotification, { notifyError } from '../../lib/openNotification';

import { updateCategoryRequest } from '../../services/categoryAPI';
import { categoryUpdated, fetchCategories, selectCategory } from '../../redux/sliceReducers/categoriesSlice';
import { selectToken } from '../../redux/sliceReducers/loggedAuthorSlice';
import { initializeBlogs, selectPublishedBlogs } from '../../redux/sliceReducers/blogsSlice';

export default function BlogsPageByCategory() {
	const { categorySlug } = useParams();
	const dispatch = useDispatch();
	const authorToken = useSelector(selectToken);
	const category = useSelector(selectCategory(categorySlug));
	const publishedBlogs = useSelector(selectPublishedBlogs);
	const categoryStatus = useSelector(state => state.categories.status);
	const blogStatus = useSelector(state => state.blogs.status);

	const [form] = Form.useForm();
	const [blogsByCategory, setBlogsByCategory] = useState(null);

	useEffect(() => {
		if (categoryStatus === 'idle') {
			dispatch(fetchCategories())
		}
		if (blogStatus === 'idle') {
			dispatch(initializeBlogs());
		}
	}, [dispatch, categoryStatus, blogStatus]);

	useEffect(() => {
		if (categoryStatus === 'succeeded' && blogStatus === 'succeeded') {
			const filteredBlogs = publishedBlogs.filter(blog => category.blogs.includes(blog.id));
			setBlogsByCategory(filteredBlogs);
		};
	}, [categoryStatus, blogStatus])

	const handleUpdate = async (values) => {
		try {
			const response = await updateCategoryRequest(category.id, values, authorToken);
			if (response?.errors) {
				form.setFields(
					response.errors.map(error => ({ name: error.param, errors: [error.msg] }))
				);
			} else if (!!response?.error) {
				form.setFields([{ name: 'name', errors: [response?.error] }]);
			} else {
				dispatch(categoryUpdated(values));
				openNotification({
					type: 'success',
					message: 'Successful operation',
					description: `Category "${values.name}" is successfully updated`,
				});
			}
		} catch (error) {
			form.setFields([{ name: 'name', errors: ['An error occurred while submitting the form.'] }]);
			notifyError(error);
		}
	}

	if (blogsByCategory === null || blogStatus !== 'succeeded'
		|| categoryStatus !== 'succeeded') {
		return <Spin />
	}

	return <Layout>
		<CategoryForm
			isEditing={true}
			category={category}
			handleSubmit={handleUpdate}
			form={form}
		/>
		<Divider />
		<BlogList
			headerText={`Blogs under category ${categorySlug}`}
			blogs={blogsByCategory}
		/>
	</Layout>
}
import { Form, Layout, Spin } from 'antd';
import CategoryForm from '../../components/Category/CategoryForm';
import BlogList from '../../components/Blog/BlogList';
import { useParams } from 'react-router-dom';
import { selectToken } from '../../redux/sliceReducers/loggedAuthorSlice';
import { useDispatch, useSelector } from 'react-redux';
import { updateCategoryRequest } from '../../services/categoryAPI';
import { fetchCategories, selectCategory, updateCategoryReducer } from '../../redux/sliceReducers/categoriesSlice';
import openNotification, { notifyError } from '../../lib/openNotification';
import { useEffect, useState } from 'react';
import { initializeBlogs, selectBlogs } from '../../redux/sliceReducers/blogsSlice';

export default function BlogsPageByCategory() {
	const { categoryName } = useParams();
	const dispatch = useDispatch();
	const authorToken = useSelector(selectToken);
	const category = useSelector(selectCategory(categoryName));
	const publishedBlogs = useSelector(selectBlogs).filter(blog => blog?.isPublished);
	const [blogsByCategory, setBlogsByCategory] = useState(null);

	const [form] = Form.useForm();

	useEffect(() => {
		if (!category) {
			dispatch(fetchCategories());
		}
		if (category) {
			dispatch(initializeBlogs());
		}
	}, [dispatch, category])

	useEffect(() => {
		if (category && publishedBlogs) {
			const filteredBlogs = publishedBlogs.filter(blog => category.blogs.includes(blog.id));
			setBlogsByCategory(filteredBlogs);

			// set form fields with corresponding values from the category
			const fieldsToBeEdited = [
				{ name: 'name', value: category.name },
				{ name: 'description', value: category.description }
			];
			form.setFields(fieldsToBeEdited);
		}
	}, [publishedBlogs, category, form])

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
				dispatch(updateCategoryReducer(values));
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

	if (!blogsByCategory) {
		return <Spin />
	}

	if (!category) {
		return <div>This category does not exist.</div>
	}

	return <Layout>
		<CategoryForm
			isEditing={true}
			category={category}
			handleSubmit={handleUpdate}
			form={form}
		/>
		<BlogList
			headerText={`Blogs under category ${categoryName}`}
			blogs={blogsByCategory}
		/>
	</Layout>
}
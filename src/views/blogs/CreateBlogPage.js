import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { selectToken } from '../../redux/sliceReducers/loggedAuthorSlice';
import { fetchCategories, selectCategories } from '../../redux/sliceReducers/categoriesSlice';
import { createBlogReducer } from '../../redux/sliceReducers/blogsSlice';
import { createBlogRequest } from '../../services/blogAPI';
import openNotification, { notifyError } from '../../lib/openNotification';
import BlogForm from '../../components/Blog/BlogForm';
import Title from 'antd/es/typography/Title';
import { Form, Layout } from 'antd';

function CreateBlogPage() {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const authorToken = useSelector(selectToken);
	const blogCategories = useSelector(selectCategories) || null;
	const [form] = Form.useForm();
	const [isSubmitBtnLoading, setIsSubmitBtnLoading] = useState(false);

	const initialFormValues = {
		title: '',
		content: '',
		categories: [],
		isPrivate: true
	}
	useEffect(() => {
		dispatch(fetchCategories())
	}, [dispatch]);

	const extractCategoryIds = (categoryNames) => {
		return blogCategories.filter(cat => categoryNames.includes(cat.name))
			.map(cat => cat.id);
	}

	const handleSuccess = (data, publishAction, blog) => {
		const navigateTo = `/blog/${data.id}${publishAction === 'save' ? '/update' : ''}`
		setIsSubmitBtnLoading(false);
		dispatch(createBlogReducer(data));
		navigate(navigateTo);
		const msgAction = publishAction === 'save' ? 'saved as draft' : 'published';
		openNotification({
			type: 'success',
			message: 'Successful operation',
			description: `New blog "${blog.title}" is successfully ${msgAction}`,
		});
	}

	const handleError = (data) => {
		setIsSubmitBtnLoading(false);
		form.setFields([{ name: 'title', errors: [data.error] }]);
	}
	const handleBlogCreate = (publishAction) => {
		setIsSubmitBtnLoading(true);
		const blog = form.getFieldsValue();
		createBlogRequest({
			blog: {
				...blog,
				categories: extractCategoryIds(blog.categories)
			},
			token: authorToken,
			publishAction
		})
			.then(data => {
				if (data && data.error) {
					handleError(data);
				} else if (data && !data.error && !data.errors) {
					handleSuccess(data, publishAction, blog);
				}
			})
			.catch(error => {
				setIsSubmitBtnLoading(false);
				notifyError(error)
			});
	}

	const handleBlogSubmit = () => () => handleBlogCreate('publish');
	const handleSaveDraft = () => () => handleBlogCreate('save');

	return <Layout>
		<Title level={3}>Create a new blog</Title>
		<BlogForm
			initialFormValues={initialFormValues}
			blogCategories={blogCategories}
			handleBlogSubmit={handleBlogSubmit}
			handleSaveDraft={handleSaveDraft}
			isSubmitBtnLoading={isSubmitBtnLoading}
			form={form}
		/>
	</Layout>
}

export default CreateBlogPage;
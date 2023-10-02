import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { selectToken } from '../../redux/sliceReducers/loggedAuthorSlice';
import { fetchCategories, selectCategories } from '../../redux/sliceReducers/categoriesSlice';
import { blogAdded } from '../../redux/sliceReducers/blogsSlice';
import { createBlogRequest } from '../../services/blogAPI';
import openNotification, { notifyError } from '../../lib/openNotification';
import BlogForm from '../../components/Blog/BlogForm';
import Title from 'antd/es/typography/Title';
import { Form, Layout, Spin } from 'antd';
import { fetchTags, selectTags } from '../../redux/sliceReducers/tagsSlice';
import { extractIds } from '../../helpers';
import useImageUpload from '../../hooks/useImageUpload';

function CreateBlogPage() {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const authorToken = useSelector(selectToken);
	const categories = useSelector(selectCategories);
	const tags = useSelector(selectTags);
	const tagStatus = useSelector(state => state.tags.status);
	const categoryStatus = useSelector(state => state.categories.status);

	const [form] = Form.useForm();
	const [uploadedImage, uploadedImageSetters] = useImageUpload();
	const [isDataSubmitting, setIsDataSubmitting] = useState(false);

	const initialFormValues = {
		title: '',
		content: '',
		category: undefined,
		tags: [],
		isPrivate: true
	}

	useEffect(() => {
		if (tagStatus === 'idle') {
			dispatch(fetchTags())
		}
		if (categoryStatus === 'idle') {
			dispatch(fetchCategories())
		}
	}, [categoryStatus, dispatch, tagStatus]);

	const handleSuccess = (data, publishAction, blog) => {
		const navigateTo = `/blog/${data.id}${publishAction === 'save' ? '/update' : ''}`
		dispatch(blogAdded(data));
		navigate(navigateTo);
		const msgAction = publishAction === 'save' ? 'saved as draft' : 'published';
		openNotification({
			type: 'success',
			message: 'Successful operation',
			description: `New blog "${blog.title}" is successfully ${msgAction}`,
		});
	}

	const handleError = (data) => {
		form.setFields([{ name: 'title', errors: [data.error] }]);
	}

	const handleBlogCreate = async (publishAction) => {
		setIsDataSubmitting(true);
		try {
			const blog = form.getFieldsValue();
			const data = await createBlogRequest({
				blog: {
					title: blog.title,
					content: blog.content,
					isPrivate: blog.isPrivate,
					tags: extractIds({ docs: tags, values: blog.tags, key: 'name' }),
					category: extractIds({ docs: categories, values: [blog.category], key: 'name' })[0] || null
				},
				token: authorToken,
				publishAction,
				...(uploadedImage.file ? { file: uploadedImage.file } : {})
			});

			if (data && data.error) {
				handleError(data);
			} else if (data && !data.error && !data.errors) {
				handleSuccess(data, publishAction, blog);
			}
		} catch (error) {
			notifyError(error);
		} finally {
			setIsDataSubmitting(false);
		}
	}

	const handleBlogSubmit = () => () => handleBlogCreate('publish');
	const handleSaveDraft = () => () => handleBlogCreate('save');

	if (tagStatus !== 'succeeded' || categoryStatus !== 'succeeded') {
		return <Spin />
	}

	return <Layout>
		<Title level={3}>Create a new blog</Title>
		<BlogForm
			initialFormValues={initialFormValues}
			blogCategories={categories}
			blogTags={tags}
			handleBlogSubmit={handleBlogSubmit}
			handleSaveDraft={handleSaveDraft}
			isDataSubmitting={isDataSubmitting}
			form={form}
			uploadedImage={uploadedImage}
			uploadedImageSetters={uploadedImageSetters}
		/>
	</Layout>
}

export default CreateBlogPage;
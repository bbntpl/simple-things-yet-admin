import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Form, Layout, Spin } from 'antd';

import { selectToken } from '../../redux/sliceReducers/loggedAuthorSlice';
import { categoryBlogsUpdated, fetchCategories, selectCategories } from '../../redux/sliceReducers/categoriesSlice';
import { blogAdded } from '../../redux/sliceReducers/blogsSlice';
import { createBlogRequest } from '../../services/blogAPI';
import { notifyError, notifySuccess } from '../../lib/openNotification';
import BlogForm from '../../components/Blog/BlogForm';
import Title from 'antd/es/typography/Title';
import { fetchTags, selectTags, tagBlogsUpdated } from '../../redux/sliceReducers/tagsSlice';
import { extractIds } from '../../helpers';
import useImageUpload from '../../hooks/useImageUpload';
import { fetchImageDocById } from '../../redux/sliceReducers/imageDocsSlice';

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
	const [errors, setErrors] = useState([]);
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

	const handleSuccess = (updatedBlog, publishAction) => {
		const navigateTo = `/blog/${updatedBlog.id}${publishAction === 'save' ? '/update' : ''}`
		dispatch(blogAdded(updatedBlog));

		// Update categories if they exist
		if (updatedBlog.category) {
			dispatch(categoryBlogsUpdated({
				categoryId: updatedBlog.category,
				blogId: updatedBlog.id
			}))
		}

		// Update tags if they exist
		if (updatedBlog.tags) {
			dispatch(tagBlogsUpdated({
				tagIds: updatedBlog.tags,
				blogId: updatedBlog.id
			}))
		}

		if (uploadedImage.file) {
			dispatch(fetchImageDocById(updatedBlog.imageFile));
		}
		navigate(navigateTo);
		const msgAction = publishAction === 'save' ? 'saved as draft' : 'published';
		notifySuccess(`New blog "${updatedBlog.title}" is successfully ${msgAction}`);
	}

	const handleError = (errors) => setErrors([...errors]);

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
					// If there are no ids, pass 'NULL' instead
					category: extractIds({ docs: categories, values: [blog.category], key: 'name' })[0] || 'NULL'
				},
				credit: {
					authorName: blog?.authorName || '',
					authorURL: blog?.authorURL || '',
					sourceName: blog?.sourceName || '',
					sourceURL: blog?.sourceURL || ''
				},
				existingImageId: uploadedImage.existingImageId,
				publishAction,
				...(uploadedImage.file ? { file: uploadedImage.file } : {})
			}, authorToken);

			if (data && data.error) {
				handleError([data.error]);
			} else if (data && !data.error && !data.errors) {
				handleSuccess(data, publishAction);
			}
		} catch (error) {
			notifyError(error);
		} finally {
			setIsDataSubmitting(false);
		}
	}

	const handleBlogSubmit = () => () => handleBlogCreate('publish');
	const handleSaveDraft = () => () => handleBlogCreate('save');

	if (tagStatus !== 'succeeded' || categoryStatus !== 'succeeded' || !form.getFieldsValue()) {
		return <Spin />
	}

	return (
		<Layout style={{
			display: 'flex',
			justifyContent: 'center',
			alignItems: 'center'
		}}>
			<Title level={3}>Create a new blog</Title>
			<BlogForm
				blog={initialFormValues}
				blogCategories={categories}
				blogTags={tags}
				handleBlogSubmit={handleBlogSubmit}
				handleSaveDraft={handleSaveDraft}
				isDataSubmitting={isDataSubmitting}
				form={form}
				uploadedImage={uploadedImage}
				uploadedImageSetters={uploadedImageSetters}
				errors={errors}
			/>
		</Layout>)
}

export default CreateBlogPage;
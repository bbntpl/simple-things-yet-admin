import { useEffect, useState } from 'react';
import { Form, Layout, Spin } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import Title from 'antd/es/typography/Title';

import BlogForm from '../../components/Blog/BlogForm';
import { notifyError, notifySuccess } from '../../lib/openNotification';

import { blogDeleted, blogUpdated, initializeBlogs } from '../../redux/sliceReducers/blogsSlice';
import { selectToken } from '../../redux/sliceReducers/loggedAuthorSlice';
import { categoryBlogsUpdated, fetchCategories, selectCategories } from '../../redux/sliceReducers/categoriesSlice';
import { fetchTags, selectTags, tagBlogsUpdated } from '../../redux/sliceReducers/tagsSlice';
import { deleteBlogRequest, fetchBlogByIdRequest, updateBlogImageRequest, updateBlogRequest } from '../../services/blogAPI';
import { extractIds } from '../../helpers';
import useImageUpload from '../../hooks/useImageUpload';

function UpdateBlogPage() {
	const { id } = useParams();
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const authorToken = useSelector(selectToken);
	const blogCategories = useSelector(selectCategories);
	const blogTags = useSelector(selectTags);
	const categoryStatus = useSelector(state => state.categories.status);
	const tagStatus = useSelector(state => state.tags.status);
	const blogStatus = useSelector(state => state.blogs.status);

	const [blog, setBlog] = useState(null)
	const [errors, setErrors] = useState([]);
	const [uploadedImage, uploadedImageSetters] = useImageUpload();
	const [form] = Form.useForm()

	const [isDataSubmitting, setIsDataSubmitting] = useState(false);

	useEffect(() => {
		if (categoryStatus === 'idle') {
			dispatch(fetchCategories())
		}
		if (tagStatus === 'idle') {
			dispatch(fetchTags())
		}

		// Ensure that the blogs is fetched before it gets updated
		// if the user directly accessed this webpage
		if (blogStatus === 'idle') {
			dispatch(initializeBlogs())
		}
	}, [dispatch, categoryStatus, tagStatus, blogStatus]);

	useEffect(() => {
		try {
			const initializeBlog = async () => {
				const fetchedBlog = await fetchBlogByIdRequest(id);
				setBlog(fetchedBlog);
			}
			initializeBlog();
		} catch (error) {
			notifyError(error)
		}
	}, [id])

	const updateBlog = async (args) => {
		const { updatedBlog, imageCredit, publishAction } = args;
		try {
			setIsDataSubmitting(true);
			const data = await updateBlogRequest({
				blogId: blog.id,
				updatedBlog,
				publishAction
			}, authorToken);

			const imageData = await updateBlogImageRequest({
				existingImageId: uploadedImage.existingImageId,
				credit: imageCredit,
				file: uploadedImage.file,
				blogId: blog.id
			}, authorToken);

			if (imageData?.errors) {
				const errors = imageData?.errors || data?.errors;
				setErrors(errors.map(error => error.msg));
			} else if (imageData?.error || data?.error) {
				if (imageData?.error) {
					setErrors(prevErrors => ([...prevErrors, imageData.error]))
				}
				if (data?.error) {
					setErrors(prevErrors => ([...prevErrors, data.error]))
				}
			} else {
				dispatch(blogUpdated(data));
				if (publishAction === 'publish') {
					navigate(`/blog/${data.id}`);
				}

				const msgAction = publishAction === 'save' ? 'updated' : 'published';
				notifySuccess(`Blog "${blog.title}" is successfully ${msgAction}`);
			}
		} catch (error) {
			notifyError(error);
		} finally {
			setIsDataSubmitting(false);
		}
	}

	const handleBlogUpdate = (publishAction) => {
		const values = form.getFieldsValue();
		const updatedBlog = {
			title: values.title,
			content: values.content,
			author: blog.author,
			category: extractIds({
				docs: blogCategories,
				values: [values.category],
				key: 'name'
			})[0] || null,
			tags: extractIds({
				docs: blogTags,
				values: values.tags,
				key: 'name'
			})
		}

		const imageCredit = {
			authorName: values?.authorName || '',
			authorURL: values?.authorURL || '',
			sourceName: values?.sourceName || '',
			sourceURL: values?.sourceURL || ''
		}

		updateBlog({ updatedBlog, imageCredit, publishAction });
	}

	const handleSaveDraft = () => () => handleBlogUpdate('save');
	const handleBlogSubmit = () => () => handleBlogUpdate('publish');

	const handleBlogDeletion = async () => {
		try {
			await deleteBlogRequest(blog.id, authorToken)
			dispatch(blogDeleted(blog.id));

			// Update categories if they exist
			if (blog.category) {
				dispatch(categoryBlogsUpdated({
					categoryId: blog.category,
					blogId: blog.id
				}))
			}

			// Update tags if they exist
			if (blog.tags) {
				dispatch(tagBlogsUpdated({
					tagIds: blog.tags,
					blogId: blog.id
				}))
			}

			const navigateTo = blog?.isPublished ? '/blogs' : '/drafts';
			navigate(navigateTo);
			notifySuccess(`The blog with id ${blog.id} is successfully deleted`);
		} catch (error) {
			notifyError(error);
		}
	}

	if (blog === null || categoryStatus !== 'succeeded' ||
		tagStatus !== 'succeeded' || blogStatus !== 'succeeded') {
		return <Spin />;
	}

	return <Layout>
		<Title level={3}>Update Blog</Title>
		<BlogForm
			blog={blog}
			blogCategories={blogCategories}
			blogTags={blogTags}
			isEditing={true}
			handleSaveDraft={handleSaveDraft}
			handleBlogSubmit={handleBlogSubmit}
			handleBlogDeletion={handleBlogDeletion}
			isDataSubmitting={isDataSubmitting}
			uploadedImage={uploadedImage}
			uploadedImageSetters={uploadedImageSetters}
			form={form}
			errors={errors}
		/>
	</Layout>
}

export default UpdateBlogPage;
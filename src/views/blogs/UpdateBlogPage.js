import { useEffect, useState } from 'react';
import { Form, Layout, Spin } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import Title from 'antd/es/typography/Title';

import BlogForm from '../../components/Blog/BlogForm';
import openNotification, { notifyError } from '../../lib/openNotification';

import { blogDeleted, blogUpdated, initializeBlogs } from '../../redux/sliceReducers/blogsSlice';
import { selectToken } from '../../redux/sliceReducers/loggedAuthorSlice';
import { fetchCategories, selectCategories } from '../../redux/sliceReducers/categoriesSlice';
import { fetchTags, selectTags } from '../../redux/sliceReducers/tagsSlice';
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
	const [uploadedImage, uploadedImageSetters] = useImageUpload();
	const [form] = Form.useForm()

	const [isSubmitBtnLoading, setIsSubmitBtnLoading] = useState(false);

	useEffect(() => {
		if (categoryStatus === 'idle') {
			dispatch(fetchCategories())
		}

		if (tagStatus === 'idle') {
			dispatch(fetchTags())
		}

		// make sure the blogs is fetched before being updated
		// if user directly accessed this webpage
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
		const { updatedBlog, publishAction } = args;
		try {
			setIsSubmitBtnLoading(true);
			const data = await updateBlogRequest({
				blogId: blog.id,
				updatedBlog,
				token: authorToken,
				publishAction
			});

			if (uploadedImage.file) {
				await updateBlogImageRequest({
					file: uploadedImage.file,
					token: authorToken,
					blogId: blog.id
				});
			}

			if (data?.error) throw new Error(data.error);

			setIsSubmitBtnLoading(false);
			dispatch(blogUpdated(data));

			if (publishAction === 'publish') {
				navigate(`/blog/${data.id}`);
			}

			const msgAction = publishAction === 'save' ? 'updated' : 'published';
			openNotification({
				type: 'success',
				message: 'Successful operation',
				description: `Blog "${blog.title}" is successfully ${msgAction}`,
			});
		} catch (error) {
			setIsSubmitBtnLoading(false);
			notifyError(error);
		}
	}

	const handleBlogUpdate = (publishAction) => {
		setIsSubmitBtnLoading(true);
		setTimeout(() => {
			const currentFormValues = form.getFieldsValue();
			const updatedBlog = {
				...blog,
				...currentFormValues,
				category: extractIds({
					docs: blogCategories,
					values: [currentFormValues.category],
					key: 'name'
				})[0] || null,
				tags: extractIds({
					docs: blogTags,
					values: currentFormValues.tags,
					key: 'name'
				})
			}

			updateBlog({ updatedBlog, publishAction });
		}, 500);
	}

	const handleSaveDraft = () => () => handleBlogUpdate('save');
	const handleBlogSubmit = () => () => handleBlogUpdate('publish');

	const handleBlogDeletion = () => {
		deleteBlogRequest(blog.id, authorToken)
			.then(() => {
				dispatch(blogDeleted(blog.id));
				const navigateTo = blog?.isPublished ? '/blogs' : '/drafts';
				navigate(navigateTo);
				openNotification({
					type: 'success',
					message: 'Operation successful',
					description: `The blog with id ${blog.id} is successfully deleted`
				})
			})
			.catch(error => notifyError(error))
	}

	if (blog === null || categoryStatus !== 'succeeded' ||
		tagStatus !== 'succeeded' || blogStatus !== 'succeeded') {
		return <Spin />;
	}

	return <Layout>
		<Title level={3}>Update Blog</Title>
		<BlogForm
			initialFormValues={{
				isPublished: blog.isPublished,
				content: blog.content,
				title: blog.title,
				category: blog.category,
				tags: blog.tags,
				isPrivate: blog.isPrivate,
				imageId: blog.imageId
			}}
			blogCategories={blogCategories}
			blogTags={blogTags}
			isEditing={true}
			handleSaveDraft={handleSaveDraft}
			handleBlogSubmit={handleBlogSubmit}
			handleBlogDeletion={handleBlogDeletion}
			isSubmitBtnLoading={isSubmitBtnLoading}
			uploadedImage={uploadedImage}
			uploadedImageSetters={uploadedImageSetters}
			form={form}
		/>
	</Layout>
}

export default UpdateBlogPage;
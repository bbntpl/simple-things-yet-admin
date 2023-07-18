import Title from 'antd/es/typography/Title';
import BlogForm from '../../components/Blog/BlogForm';
import { useNavigate, useParams } from 'react-router-dom';
import { Form, Layout, Spin } from 'antd';
import { deleteBlogRequest, fetchBlogByIdRequest, updateBlogRequest } from '../../services/blogAPI';
import openNotification, { notifyError } from '../../lib/openNotification';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { deleteBlogReducer, updateBlogReducer } from '../../redux/sliceReducers/blogsSlice';
import { selectToken } from '../../redux/sliceReducers/loggedAuthorSlice';
import { fetchCategories, selectCategories } from '../../redux/sliceReducers/categoriesSlice';
import { fetchTags, selectTags } from '../../redux/sliceReducers/tagsSlice';
import { extractIds } from '../../utils/helperFuncs';

function UpdateBlogPage() {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const authorToken = useSelector(selectToken);
	const blogCategories = useSelector(selectCategories) || null;
	const blogTags = useSelector(selectTags) || null;
	const { id } = useParams();
	const [blog, setBlog] = useState(null)
	const [form] = Form.useForm()
	const [isDataReady, setIsDataReady] = useState(false);

	const [isSubmitBtnLoading, setIsSubmitBtnLoading] = useState(false);

	console.log(blogTags, blogCategories);
	useEffect(() => {
		console.log(blogTags, blogCategories);
		if (blogTags && blogCategories) {
			setIsDataReady(true);
			return;
		}
		dispatch(fetchTags())
		dispatch(fetchCategories())
			.then(() => setIsDataReady(true))
	}, [dispatch, blogTags, blogCategories]);

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

	const handleBlogUpdate = (publishAction) => {
		setIsSubmitBtnLoading(true);
		setTimeout(() => {
			const currentFormValues = form.getFieldsValue();
			const updatedBlog = {
				...blog,
				...currentFormValues,
				category: extractIds({
					docs: blogCategories,
					values: currentFormValues.categories,
					key: 'name'
				}),
				tags: extractIds({
					docs: blogTags,
					values: currentFormValues.tags,
					key: 'name'
				})
			}

			updateBlogRequest({
				blogId: blog.id,
				updatedBlog,
				token: authorToken,
				publishAction
			})
				.then(data => {
					setIsSubmitBtnLoading(false);
					dispatch(updateBlogReducer(data));

					publishAction === 'publish' && navigate(`/blog/${data.id}`);
					const msgAction = publishAction === 'save' ? 'updated' : 'published';
					openNotification({
						type: 'success',
						message: 'Successful operation',
						description: `Blog "${blog.title}" is successfully ${msgAction}`,
					})
				})
				.catch(error => {
					setIsSubmitBtnLoading(false);
					notifyError(error)
				});
		}, 500);
	}

	const handleSaveDraft = () => () => handleBlogUpdate('save');
	const handleBlogSubmit = () => () => handleBlogUpdate('publish');

	const handleBlogDeletion = () => {
		deleteBlogRequest(blog.id, authorToken)
			.then(() => {
				dispatch(deleteBlogReducer);
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

	if (!blog || !blog === null || isDataReady) {
		return <Spin />;
	}

	return <Layout>
		<Title level={3}>Update Blog</Title>
		<BlogForm
			initialFormValues={{
				isPublished: blog.isPublished,
				content: blog.content,
				title: blog.title,
				categories: blog.categories,
				isPrivate: blog.isPrivate
			}}
			blogCategories={blogCategories}
			isEditing={true}
			handleSaveDraft={handleSaveDraft}
			handleBlogSubmit={handleBlogSubmit}
			handleBlogDeletion={handleBlogDeletion}
			isSubmitBtnLoading={isSubmitBtnLoading}
			form={form}
		/>
	</Layout>
}

export default UpdateBlogPage;
import Title from 'antd/es/typography/Title';
import BlogForm from '../../components/Blog/BlogForm';
import { useNavigate, useParams } from 'react-router-dom';
import { Layout, Spin } from 'antd';
import { deleteBlogRequest, fetchBlogByIdRequest, updateBlogRequest } from '../../services/blogAPI';
import openNotification from '../../lib/openNotification';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { deleteBlogReducer, updateBlogReducer } from '../../redux/sliceReducers/blogsSlice';
import { selectToken } from '../../redux/sliceReducers/loggedAuthorSlice';

function UpdateBlogPage() {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const authorToken = useSelector(selectToken);
	const { id } = useParams();
	const [blog, setBlog] = useState(null)

	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		try {
			const initializeBlog = async () => {
				const fetchedBlog = await fetchBlogByIdRequest(id);
				setBlog(fetchedBlog);
			}

			initializeBlog();
		} catch (error) {
			openNotification({
				type: 'error',
				description: 'Operation failed',
				message: error.message
			})
		}

	}, [id])


	const handleBlogSubmit = () => {
		setIsLoading(true);
		setTimeout(() => {
			updateBlogRequest(blog.id, blog, authorToken)
				.then(data => {
					setIsLoading(false);
					dispatch(updateBlogReducer(data));
					navigate(`/blog/${data.id}`);
					openNotification({
						type: 'success',
						message: 'Successful operation',
						description: `Blog "${blog.title}" is successfully updated`,
					})
				})
				.catch(error => {
					setIsLoading(false);
					openNotification({
						type: 'error',
						message: 'Operation failed',
						description: error.message,
					})
				});
		}, 1100);
	}

	const handleBlogDeletion = (blogId) => {
		deleteBlogRequest(blogId, authorToken)
			.then(() => {
				dispatch(deleteBlogReducer);
				navigate('/blogs');
				openNotification({
					type: 'success',
					message: 'Operation successful',
					description: `The blog with id ${blogId} is successfully deleted`
				})
			})
			.catch((error) => {
				openNotification({
					type: 'error',
					message: 'Operation failed',
					description: error.message
				})
			})
	}

	if (!blog || !blog === null) {
		return <Spin />;
	}

	return <Layout>
		<Title level={3}>
			Update Blog
		</Title>
		<BlogForm
			blog={blog}
			setBlog={setBlog}
			editing={true}
			handleBlog={handleBlogSubmit}
			handleBlogDeletion={handleBlogDeletion}
			isLoading={isLoading}
		/>
	</Layout>
}

export default UpdateBlogPage;
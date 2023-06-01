import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { selectToken } from '../../redux/sliceReducers/loggedAuthorSlice';
import { fetchCategories } from '../../redux/sliceReducers/categoriesSlice';
import { createBlogReducer, deleteBlogReducer } from '../../redux/sliceReducers/blogsSlice';
import { createBlogRequest, deleteBlogRequest } from '../../services/blogAPI';
import openNotification from '../../lib/openNotification';
import BlogForm from '../../components/Blog/BlogForm';

function CreateBlogPage() {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const authorToken = useSelector(selectToken);
	const [blog, setBlog] = useState({
		title: '',
		content: '',
		categories: [],
		isPrivate: true
	});
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		dispatch(fetchCategories())
	}, [dispatch]);

	const handleBlogSubmit = () => {
		setIsLoading(true);
		setTimeout(() => {
			createBlogRequest(blog, authorToken)
				.then(data => {
					setIsLoading(false);
					dispatch(createBlogReducer(data));
					navigate(`/blog/${data.id}`);
					openNotification({
						type: 'success',
						message: 'Successful operation',
						description: `New blog "${blog.title}" is successfully created`,
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
		deleteBlogRequest()
			.then(() => {
				dispatch(deleteBlogReducer)
				navigate('/blogs');
				openNotification({
					type: 'success',
					message: 'Operation successful',
					description: `The blog with id ${blogId} is successfully deleted`
				})
			})
			.catch(() => {
				openNotification({
					type: 'error',
					message: 'Operation failed',
					description: `An error occurred while trying to delete the blog with id ${blogId} `
				})
			})
	}

	return <div>
		<BlogForm
			blog={blog}
			setBlog={setBlog}
			handleBlogSubmit={handleBlogSubmit}
			handleBlogDeletion={handleBlogDeletion}
			editing={false}
			isLoading={isLoading}
		/>
	</div>
}

export default CreateBlogPage;
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { selectToken } from '../../redux/sliceReducers/loggedAuthorSlice';
import { fetchCategories, selectCategories } from '../../redux/sliceReducers/categoriesSlice';
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
		private: true
	});

	useEffect(() => {
		dispatch(fetchCategories())
	}, [dispatch]);

	const handleBlogSubmit = (e) => {
		e.preventDefault();
		createBlogRequest(blog, authorToken)
			.then(data => {
				setTimeout(() => {
					dispatch(createBlogReducer(blog));
					navigate(`/blog/${data.id}`);
					openNotification({
						type: 'success',
						message: 'Successful operation',
						description: `New blog "${blog.title}" is successfully created`,
					})
				}, 1100);
			})
			.catch(error => {
				throw new Error(error);
			});
	}

	const handleBlogDeletion = (blogId) => {
		deleteBlogRequest()
			.then(() => {
				setTimeout(() => {
					dispatch(deleteBlogReducer)
					navigate('/blogs');
					openNotification({
						type: 'success',
						message: 'Operation successful',
						description: `The blog with id ${blogId} is successfully deleted`
					})
				}, 1100);
			})
			.catch(() => {
				openNotification({
					type: 'error',
					message: 'Operation failed',
					description: `An error occurred while trying to delete the blog with id ${blogId}`
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
		/>
	</div>
}

export default CreateBlogPage;
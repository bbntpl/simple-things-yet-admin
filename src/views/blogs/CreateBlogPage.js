import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { selectToken } from '../../redux/sliceReducers/loggedAuthorSlice';
import { fetchCategories } from '../../redux/sliceReducers/categoriesSlice';
import { createBlogReducer } from '../../redux/sliceReducers/blogsSlice';
import { createBlogRequest } from '../../services/blogAPI';
import openNotification from '../../lib/openNotification';
import BlogForm from '../../components/Blog/BlogForm';
import Title from 'antd/es/typography/Title';
import { Layout } from 'antd';

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

	return <Layout>
		<Title level={2}>Create a new blog</Title>
		<BlogForm
			blog={blog}
			setBlog={setBlog}
			handleBlogSubmit={handleBlogSubmit}
			editing={false}
			isLoading={isLoading}
		/>
	</Layout>
}

export default CreateBlogPage;
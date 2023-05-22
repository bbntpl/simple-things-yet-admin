import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import openNotification from '../../lib/openNotification';
import { fetchBlogByIdRequest } from '../../services/blogAPI'
import { Spin } from 'antd';
import BlogArticle from '../../components/Blog/BlogArticle';

function BlogPage() {
	const { id } = useParams();
	const [blog, setBlog] = useState(null);

	useEffect(() => {
		async function initializeBlog() {
			try {
				const fetchedBlog = await fetchBlogByIdRequest(id);
				setBlog(fetchedBlog)
			} catch (error) {
				openNotification({
					type: error,
					message: 'Operation failed',
					description: error.message
				})
			}
		}

		initializeBlog();
	}, [id])

	return <div>{blog ? <BlogArticle blog={blog} /> : <Spin />}</div>
}

export default BlogPage;
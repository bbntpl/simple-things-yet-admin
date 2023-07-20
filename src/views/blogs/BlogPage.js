import { useState, useEffect } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Spin, Divider, Form, Button } from 'antd';
import ReactQuill from 'react-quill';

import openNotification, { notifyError } from '../../lib/openNotification';
import { createAuthorCommentRequest } from '../../services/commentAPI';
import { createAuthorComment } from '../../redux/sliceReducers/commentsSlice';
import { selectLoggedAuthor } from '../../redux/sliceReducers/loggedAuthorSlice';
import { fetchBlogByIdRequest } from '../../services/blogAPI'
import BlogArticle from '../../components/Blog/BlogArticle';
import BlogCommentList from '../../components/Blog/BlogCommentList';

const modules = {
	toolbar: [
		['bold', 'italic', 'underline'],
		['link', 'image', 'blockquote'],
		[{ 'list': 'ordered' }, { 'list': 'bullet' }],
	],
};

const formats = [
	'bold', 'italic', 'underline', 'link', 'blockquote', 'list', 'bullet',
];

function BlogPage() {
	const { id } = useParams();
	const dispatch = useDispatch();

	const loggedAuthor = useSelector(selectLoggedAuthor);
	const [newComment, setNewComment] = useState({
		content: '',
	});
	const [blog, setBlog] = useState(null);
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		async function initializeBlog() {
			try {
				const fetchedBlog = await fetchBlogByIdRequest(id);
				setBlog(fetchedBlog)
			} catch (error) {
				notifyError(error)
			}
		}

		initializeBlog();
	}, [id])

	useEffect(() => {
		if (loggedAuthor & blog) {
			setNewComment((newComment) => ({
				...newComment,
				blog: blog.id,
				user: loggedAuthor.id,
			}));
		}
	}, [loggedAuthor, blog]);

	const handleCommentChange = (content) => {
		setNewComment(newComment => ({
			...newComment,
			content,
		}));
	}

	const handleCommentSubmit = () => {
		setIsLoading(true)
		setTimeout(async () => {
			try {
				const response = await createAuthorCommentRequest(newComment, loggedAuthor.token);
				setIsLoading(false);
				dispatch(createAuthorComment(response));
				openNotification({
					type: 'success',
					message: 'Successful operation',
					description: 'New comment is succesfully submitted'
				})
			} catch (error) {
				setIsLoading(false);
				notifyError(error)
			}
		}, 500);
	}

	return <>
		{
			(blog && !blog.isPublished) && (
				<Navigate to={`/blog/${blog.id}/update`} replace={true} />
			)
		}
		{blog
			? <>
				<BlogArticle blog={blog} />

				<Divider orientation='left'>New Comment</Divider>
				<Form onFinish={handleCommentSubmit}>
					<ReactQuill
						value={newComment.content}
						onChange={handleCommentChange}
						modules={modules}
						formats={formats}
						theme='snow'
					/>
					<Button
						type='primary'
						htmlType='submit'
						loading={isLoading}
						style={{ margin: '1rem 0 0 0' }}
					>
						Submit comment
					</Button>
				</Form>
				<BlogCommentList blogComments={blog.comments} />
			</>
			: <Spin />}
	</>
}

export default BlogPage;
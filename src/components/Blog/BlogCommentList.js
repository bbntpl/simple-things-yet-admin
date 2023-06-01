import { Space, Spin } from 'antd';
import BlogComment from './BlogComment';
import Title from 'antd/es/typography/Title';
import { useEffect, useState } from 'react';
import { fetchCommentByIdRequest } from '../../services/commentAPI';

export default function BlogCommentList({ blogComments }) {
	const [comments, setComments] = useState(null);

	useEffect(() => {
		function initializeComments() {
			const promises = blogComments.map(commentId => fetchCommentByIdRequest(commentId));

			Promise.all(promises).then((fetchedComments) => {
				setComments(fetchedComments)
			})
		}

		initializeComments();
	}, [blogComments])

	if (!comments) {
		return <Spin />
	}

	return (
		<>
			<Title level={3} >Comments ({blogComments.length})</Title>
			<Space size='large'>
				{
					comments.length > 0 ?
						comments.map(comment => (
							<BlogComment key={comment.id} comment={comment} />
						))
						: '"Crickets chirping... your wise words could break the silence!"'}
			</Space>
		</>
	);
}
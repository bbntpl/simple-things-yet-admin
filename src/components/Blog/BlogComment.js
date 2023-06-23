import { useEffect, useState } from 'react';
import { Tooltip, Avatar } from 'antd';
import { Comment } from '@ant-design/compatible'
import moment from 'moment';
import { Link } from 'react-router-dom';
import { UserOutlined } from '@ant-design/icons';
import DOMPurify from 'dompurify';

export default function BlogComment({ comment }) {
	const getUserInitialState = (comment) => {
		if (comment.author) {
			return {
				...comment.author,
				type: '(Author)',
				route: '/profile',
				avatarSrc: 'https://avatars.githubusercontent.com/u/96958013?v=4author.avatarUrl'
			};
		} else if (comment.viewer) {
			return {
				...comment.viewer,
				route: `viewers/${comment.viewer.id}`
			};
		} else {
			return {
				type: null,
				route: null,
				avatarSrc: <UserOutlined />
			};
		}
	};

	const [user, setUser] = useState(() => getUserInitialState(comment));
	const sanitizedContent = DOMPurify.sanitize(comment.content)

	useEffect(() => {
		setUser(getUserInitialState(comment));
	}, [comment]);

	return (
		<Comment
			author={
				<Link to={user.route}>
					{user.name} {user.type}
				</Link>
			}
			avatar={
				<Avatar
					src={user.avatarSrc}
					alt={user.name}
				/>
			}
			content={
				<div dangerouslySetInnerHTML={{ __html: sanitizedContent }} />
			}
			datetime={
				<Tooltip title={moment().format('YYYY-MM-DD HH:mm:ss')}>
					<span>{moment(comment.createdAt).fromNow()}</span>
				</Tooltip>
			}
		>
			{comment.replies?.map(reply => <BlogComment key={reply.id} comment={reply} />)}
		</Comment>
	);
}
import { Typography, Card, Tag, Row, Col, Space, Spin, Divider, Form } from 'antd';
import moment from 'moment';
import DOMPurify from 'dompurify';

import BlogCommentList from '../Blog/BlogCommentList';
import BlogAuthorInfo from '../Blog/BlogAuthorInfo';
import { HeartFilled } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import { fetchCategoryByIdRequest } from '../../services/categoryAPI';

const { Title, Text } = Typography;

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

export default function BlogArticle({ blog }) {
	console.log(blog);
	const {
		title,
		isPrivate,
		author,
		content,
		categories,
		likes,
		comments,
		createdAt,
		updatedAt,
	} = blog
	const [populatedCategories, setPopulatedCategories] = useState(null);
	const [newComment, setNewComment] = useState('');

	const sanitizedContent = DOMPurify.sanitize(content);

	const blogUpdateDate = moment(updatedAt);
	const blogCreationDate = moment(createdAt);

	useEffect(() => {
		const promiseCategories = categories.map(id => {
			return fetchCategoryByIdRequest(id);
		});

		Promise.all(promiseCategories).then(cat => {
			setPopulatedCategories(cat);
		});
	}, [categories])

	if (!populatedCategories || !blog) {
		return <Spin />
	}

	console.log(populatedCategories);
	return (
		<div style={{ margin: '1.5rem 2rem' }}>
			<Card style={{ backgroundColor: 'transparent' }}>
				<Text strong>{isPrivate
					? 'This blog is not available to the public'
					: 'This blog is available to the public'}
				</Text>
				<Title>{title}</Title>
				<BlogAuthorInfo author={author} />
				<Space wrap>
					{populatedCategories.map(category => {
						console.log(category.id, category.name);
						return (
							<Tag color='blue' key={category.id}>{category.name}</Tag>
						);
					})}
				</Space>
				<Row>
					<Col span={12} style={{ textAlign: 'left' }}>
						<Space>
							<span>{likes.length}</span>
							< HeartFilled />
						</Space>
					</Col>
					<Col span={12} style={{ textAlign: 'right' }}>
						{blogUpdateDate.isSame(blogCreationDate, 'day')
							? <Text type="secondary">Published: {blogCreationDate.format('LL')}</Text>
							: <Text type="secondary">blogUpdateDate: {blogUpdateDate.format('LL')}</Text>}
					</Col>
				</Row>
				<div dangerouslySetInnerHTML={{ __html: sanitizedContent }} />
			</Card>
			<Divider orientation='left'>New Comment</Divider>
			<Form>
			</Form>
			<ReactQuill
				value={newComment}
				onChange={handleCommentChange}
				modules={modules}
				formats={formats}
				theme='snow'
			/>
			<BlogCommentList comments={comments} />
		</div>
	);
}
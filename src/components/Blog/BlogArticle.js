import { useEffect, useState } from 'react';
import { Typography, Card, Tag, Row, Col, Space, Spin, Button, Divider } from 'antd';
import moment from 'moment';
import DOMPurify from 'dompurify';

import BlogAuthorInfo from '../Blog/BlogAuthorInfo';
import { HeartFilled } from '@ant-design/icons';
import { fetchCategoryByIdRequest } from '../../services/categoryAPI';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;

export default function BlogArticle({ blog }) {
	const {
		title,
		isPrivate,
		author,
		content,
		categories,
		likes,
		createdAt,
		updatedAt,
	} = blog
	const navigate = useNavigate();
	const [populatedCategories, setPopulatedCategories] = useState(null);

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

	const navigateToBlogEditPage = () => {
		navigate('./update');
	}

	if (!populatedCategories || !blog) {
		return <Spin />
	}

	return (
		<div style={{ margin: '1.5rem 2rem' }}>
			<Card style={{ backgroundColor: 'transparent' }}>
				<Divider>
					<Text strong>{isPrivate
						? 'This blog is not available to the public'
						: 'This blog is available to the public'}
					</Text>
				</Divider>
				<Button onClick={navigateToBlogEditPage}>
					Edit Blog
				</Button>
				<Title>{title}</Title>
				<BlogAuthorInfo author={author} />
				<Space wrap>
					{populatedCategories.map(category => {
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
							: <Text type="secondary">Last Update: {blogUpdateDate.format('LL')}</Text>}
					</Col>
				</Row>
				<div dangerouslySetInnerHTML={{ __html: sanitizedContent }} />
			</Card>
		</div>
	);
}
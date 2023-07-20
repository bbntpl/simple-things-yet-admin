import { useEffect, useState } from 'react';
import { Typography, Card, Tag, Row, Col, Space, Spin, Button, Divider } from 'antd';
import moment from 'moment';
import DOMPurify from 'dompurify';

import BlogAuthorInfo from '../Blog/BlogAuthorInfo';
import { HeartFilled } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { fetchTagByIdRequest } from '../../services/tagAPI';
import { fetchCategoryByIdRequest } from '../../services/categoryAPI';
import { notifyError } from '../../lib/openNotification';

const { Title, Text } = Typography;

export default function BlogArticle({ blog }) {
	const {
		title,
		isPrivate,
		author,
		content,
		category,
		tags,
		likes,
		createdAt,
		updatedAt,
	} = blog
	const navigate = useNavigate();
	const [populatedTags, setPopulatedTags] = useState(null);
	const [blogCategory, setBlogCategory] = useState(null);
	const [loadingStatus, setLoadingStatus] = useState({
		isCategoryLoaded: false,
		areTagsLoaded: false
	});

	const sanitizedContent = DOMPurify.sanitize(content);

	const blogUpdateDate = moment(updatedAt);
	const blogCreationDate = moment(createdAt);

	useEffect(() => {
		const promiseTags = tags.map(id => {
			return fetchTagByIdRequest(id);
		});

		Promise.all(promiseTags).then(tag => {
			setPopulatedTags(tag);
			setLoadingStatus(prevStatus => ({ ...prevStatus, areTagsLoaded: true }));
		});
	}, [tags])

	useEffect(() => {
		const initializeBlogCategory = async () => {
			const fetchedCategory = await fetchCategoryByIdRequest(category);
			setBlogCategory(fetchedCategory);
			setLoadingStatus(prevStatus => ({ ...prevStatus, isCategoryLoaded: true }));
		}

		initializeBlogCategory().catch(err => notifyError(err));
	}, [category])

	const navigateToBlogEditPage = () => {
		navigate('./update');
	}
	const areAllLoaded = Object.values(loadingStatus).every(status => status === true)

	if (!areAllLoaded || !blog) {
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
					{populatedTags.map(tag => {
						console.log(tag); // error in tag.name - tag is returning null
						return (
							<Tag color='blue' key={tag.id}>{tag.name}</Tag>
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
						{blogCategory ? <Text type='secondary'> / {blogCategory.name}</Text> : null}
					</Col>
				</Row>
				<div dangerouslySetInnerHTML={{ __html: sanitizedContent }} />
			</Card>
		</div>
	);
}
import { useEffect, useState } from 'react';
import { Typography, Card, Row, Col, Space, Spin, Button } from 'antd';
import moment from 'moment';
import DOMPurify from 'dompurify';
import { HeartFilled } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

import 'react-quill/dist/quill.snow.css';
import BlogAuthorInfo from '../Blog/BlogAuthorInfo';
import { fetchTagByIdRequest } from '../../services/tagAPI';
import { fetchCategoryByIdRequest } from '../../services/categoryAPI';
import { notifyError } from '../../lib/openNotification';
import BlogHeader from './BlogHeader';
import { getImageUrl } from '../../services/helper';
import BlogTags from './BlogTags';
import BlogStatusIndicator from './BlogStatusIndicator';

const { Text } = Typography;

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
		isPublished,
		imageFile
	} = blog
	const navigate = useNavigate();
	const [populatedTags, setPopulatedTags] = useState(null);
	const [blogCategory, setBlogCategory] = useState(null);
	const [loadingStatus, setLoadingStatus] = useState({
		isCategoryLoaded: false,
		areTagsLoaded: false
	});
	const [previewImageUrl, setPreviewImageUrl] = useState(null);

	const sanitizedContent = DOMPurify.sanitize(content);

	const blogUpdateDate = moment(updatedAt);
	const blogCreationDate = moment(createdAt);

	useEffect(() => {
		setPreviewImageUrl(getImageUrl(imageFile))
	}, [imageFile])

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
		navigate(`/blog/${blog.id}/update`);
	}
	const areAllLoaded = Object.values(loadingStatus)
		.every(status => status === true)

	if (!areAllLoaded || !blog) return <Spin />

	return (
		<div style={{ margin: '1.5rem 2rem' }}>
			<Card style={{ backgroundColor: 'transparent' }}>
				<BlogStatusIndicator isPrivate={isPrivate} isPublished={isPublished} />
				<Button onClick={navigateToBlogEditPage}>
					Edit Blog
				</Button>
				<BlogHeader title={title} previewImage={previewImageUrl} imageFileDocId={blog.imageFile} />
				<BlogAuthorInfo author={author} />
				<BlogTags tags={populatedTags} />
				<Row>
					<Col span={12} style={{ textAlign: 'left' }}>
						<Space>
							<span>{likes.length}</span>
							< HeartFilled />
						</Space>
					</Col>
					<Col span={12} style={{ textAlign: 'right' }}>
						{blogUpdateDate.isSame(blogCreationDate, 'day')
							? <Text type='secondary'>{isPublished ? 'Published: ' : 'Created: '} {blogCreationDate.format('LL')}</Text>
							: <Text type='secondary'>Last Update: {blogUpdateDate.format('LL')}</Text>}
						{blogCategory ? <Text type='secondary'> / {blogCategory.name}</Text> : null}
					</Col>
				</Row>
				<div className='ql-snow'>
					<div
						className='ql-editor blog-content'
						dangerouslySetInnerHTML={{ __html: sanitizedContent }}
					/>
				</div>
			</Card>
		</div>
	);
}
import { Typography, Card, Tag, Row, Col, Space } from 'antd';
import moment from 'moment';
import DOMPurify from 'dompurify';

import BlogCommentList from '../Blog/BlogCommentList';
import BlogAuthorInfo from '../Blog/BlogAuthorInfo';
import { HeartFilled } from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;
export default function BlogArticle({ blog }) {
	const { title,
		private: isPrivate,
		author,
		content,
		categories,
		likes,
		comments,
		createdAt,
		updatedAt,
	} = blog
	const sanitizedContent = DOMPurify.sanitize(content);

	const blogUpdateDate = moment(updatedAt);
	const blogCreationDate = moment(createdAt);

	return (
		<Card>
			<Text strong>{isPrivate ? 'Private' : 'Public'}</Text>
			<Title>{title}</Title>
			<BlogAuthorInfo author={author} />
			<div>
				{categories.map(category => (
					<Tag color="blue" key={category.id}>{category.name}</Tag>
				))}
			</div>
			<Row>
				<Col span={12}>
					<Space>
						< HeartFilled />
						<span>{likes}</span>
					</Space>
				</Col>
				<Col span={12} style={{ textAlign: 'right' }}>
					{blogUpdateDate.isSame(blogCreationDate, 'day')
						? <Text type="secondary">Published: {blogCreationDate.format('LL')}</Text>
						: <Text type="secondary">blogUpdateDate: {blogUpdateDate.format('LL')}</Text>}
				</Col>
			</Row>
			<Paragraph dangerouslySetInnerHTML={{ __html: sanitizedContent }} />
			<BlogCommentList comments={comments} />
		</Card>
	);
}
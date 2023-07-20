import { Card, Col, Row, Space } from 'antd';
import Paragraph from 'antd/es/typography/Paragraph';
import { convert } from 'html-to-text';
import DOMPurify from 'dompurify';
import { useNavigate } from 'react-router-dom';
import { HeartOutlined } from '@ant-design/icons';
import moment from 'moment';

export default function BlogCard({ blog }) {
	const {
		title,
		content,
		likes,
		createdAt,
		publishedAt,
		isPublished
	} = blog;

	const navigate = useNavigate();

	const likesCount = likes.length;
	const displayDate = isPublished ? publishedAt : createdAt;
	const formattedDate = moment(displayDate).format('MMMM Do, YYYY');

	const sanitizedContent = DOMPurify.sanitize(content);
	const plainTextContent = convert(sanitizedContent);
	const navigateToBlog = () => {
		navigate(`/blog/${blog.id}${!blog.isPublished ? '/update' : ''}`);
	}

	return (
		<Card
			title={title}
			bordered={false}
			style={{
				width: 300,
				cursor: 'pointer'
			}}
			onClick={navigateToBlog}
		>
			<Paragraph
				style={{
					margin: '0 0 2rem 0'
				}}
				ellipsis={{ rows: 5, expandable: false }}
			>
				{plainTextContent}
			</Paragraph>
			<Row justify='space-between' style={{ color: '#4C4142' }}>
				<Col span={4}>
					<Space>
						<p>{likesCount}</p>
						<HeartOutlined />
					</Space>
				</Col>
				<Col span={12}>
					<Space size='small' direction='vertical'>
						<div>
							{isPublished ? 'Published' : 'Created'} on:
						</div>
						<div>
							{formattedDate}
						</div>
					</Space>
				</Col>
			</Row>
		</Card >
	);
}
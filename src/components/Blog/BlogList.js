/* eslint-disable indent */
import { Col, Row, Select } from 'antd'
import Title from 'antd/es/typography/Title'
import BlogCard from './BlogCard'
import { useState } from 'react';

const blogListRowStyles = {
	gap: '1.5rem',
	justifyContent: 'space-evenly'
}

export default function BlogList({ headerText, blogs, listType }) {
	const [sortType, setSortType] = useState('latest');
	const dateKeyByListType = listType === 'published'
		? 'publishedAt' : 'createdAt';

	const handleChange = (value) => setSortType(value);

	const sortedBlogs = [...blogs].sort((a, b) => {
		switch (sortType) {
			case 'asc':
				return a.title.localeCompare(b.title);
			case 'desc':
				return b.title.localeCompare(a.title);
			case 'popularity':
				return b.likes - a.likes;
			case 'latest':
				return new Date(b[dateKeyByListType]) - new Date(a[dateKeyByListType]);
			case 'oldest':
				return new Date(a[dateKeyByListType]) - new Date(b[dateKeyByListType]);
			case 'availability':
				return b.isPrivate - a.isPrivate;
			default:
				return 0;
		}
	});

	return <div>
		<Title level={4}>{headerText}</Title>
		<Select
			defaultValue='latest'
			style={{ width: 150, margin: '1.2em 0' }}
			onChange={handleChange}
			options={[
				{ value: 'asc', label: 'Title (A-Z)' },
				{ value: 'desc', label: 'Title (Z-A)' },
				{ value: 'popularity', label: 'Popularity' },
				{ value: 'latest', label: 'Most Recent' },
				{ value: 'availability', label: 'Availability' },
				{ value: 'oldest', label: 'Oldest' },
			]}
		/>
		<Row
			gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}
			className='flex-row'
			style={blogListRowStyles}
		>
			{
				sortedBlogs.length > 0
					? sortedBlogs.map(blog => (
						<BlogCard blog={blog} key={blog.id} />
					))
					: <Col span={24} style={{ textAlign: 'center' }}>
						<p>No blogs yet.</p>
					</Col>
			}
		</Row>
	</div>
}
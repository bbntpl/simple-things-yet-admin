import { Col, Row } from 'antd'
import Title from 'antd/es/typography/Title'
import BlogCard from './BlogCard'

const blogListRowStyles = {
	gap: '1.5rem',
	justifyContent: 'space-evenly'
}

export default function BlogList({ headerText, blogs }) {
	return <div>
		<Title level={4}>{headerText}</Title>
		<Row
			gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}
			className='flex-row'
			style={blogListRowStyles}
		>
			{
				blogs.length > 0
					? blogs.map(blog => (
						<BlogCard blog={blog} />
					))
					: <Col span={24} style={{ textAlign: 'center' }}><p>No blogs yet.</p></Col>
			}
		</Row>
	</div>
}
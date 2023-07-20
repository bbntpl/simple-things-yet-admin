import { Col, Row } from 'antd'
import Title from 'antd/es/typography/Title'
import BlogCard from './BlogCard'

export default function BlogList({ headerText, blogs }) {
	return <div>
		<Title level={4}>{headerText}</Title>
		<Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }} className='flex-row'>
			{
				blogs.length > 0
					? blogs.map((blog, index) => (
						<Col className='gutter-row flex-col' span={24} sm={12} md={8} lg={6} key={index}>
							<BlogCard blog={blog} />
						</Col>
					))
					: <Col span={24} style={{ textAlign: 'center' }}><p>No blogs yet.</p></Col>
			}
		</Row>
	</div>
}
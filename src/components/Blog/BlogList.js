import { Space } from 'antd'
import Title from 'antd/es/typography/Title'
import BlogCard from './BlogCard'

export default function BlogList({ headerText, blogs }) {
	return <div>
		<Title level={2}>{headerText}</Title>
		<Space wrap size='large'>
			{
				blogs.length > 0
					? blogs.map(blog => {
						return <BlogCard key={blog.id} blog={blog} />
					})
					: <p>No blogs yet.</p>
			}
		</Space>
	</div>
}
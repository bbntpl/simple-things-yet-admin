import Title from 'antd/es/typography/Title';
import BlogForm from '../../components/Blog/BlogForm';

function UpdateBlogPage() {
	return <div>
		<Title level={3}>
			Update Blog
		</Title>
		<BlogForm
			blog={ }
			editing={true}
		/>
	</div>
}

export default UpdateBlogPage;
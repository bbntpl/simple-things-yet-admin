import { Space } from 'antd';
import BlogComment from './BlogComment';
import Title from 'antd/es/typography/Title';

export default function BlogCommentList({ comments }) {
	return (
		<>
			<Title level={3} >Comments ({comments.length})</Title>
			<Space size='large'>
				{
					comments.length > 0 ?
						comments.map(comment => (
							<BlogComment key={comment.id} comment={comment} />
						))
						: '"Crickets chirping... your wise words could break the silence!"'}
			</Space>
		</>
	);
}
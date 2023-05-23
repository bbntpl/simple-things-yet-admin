import { List, Typography } from 'antd';

const { Text } = Typography;

export default function AuthorComments({ commentsArray }) {
	return (
		<List
			dataSource={commentsArray}
			renderItem={comment => (
				<List.Item key={comment.id}>
					<Text>{comment.content}</Text>
				</List.Item>
			)}
		/>
	)
}
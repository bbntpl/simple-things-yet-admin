import { Divider, Typography } from 'antd';

const { Text } = Typography;

export default function BlogStatusIndicator({ isPrivate, isPublished }) {
	return (
		<Divider>
			{isPublished ? (
				<Text strong>
					{isPrivate
						? 'This blog is not available to the public'
						: 'This blog is available to the public'}
				</Text>
			) : (
				<Text strong>
					This blog is currently a saved draft (not published)
				</Text>
			)}
		</Divider>
	);
}
import { Typography, Avatar } from 'antd';

export default function BlogAuthorInfo({ author }) {
	return (
		<div>
			<Typography.Text strong>Written by: {author.name}</Typography.Text>
			<br />
			<Avatar src={'https://avatars.githubusercontent.com/u/96958013?v=4author.avatarUrl'} />
		</div>
	);
}
import { Typography, Avatar } from 'antd';
import { useEffect, useState } from 'react';
import { getImageUrl } from '../../services/helper';

const blogAuthorInfoStyles = {
	display: 'inline-flex',
	alignItems: 'center',
	margin: '1rem',
	gap: '6px'
}

export default function BlogAuthorInfo({ author }) {
	const [authorImageUrl, setAuthorImageUrl] = useState(null);

	useEffect(() => {
		const imageUrl = getImageUrl(`/author/${author.imageId}/image`);
		setAuthorImageUrl(imageUrl);
	}, [author])

	return (
		<div style={blogAuthorInfoStyles}>
			<Typography.Text strong>Written by:  {author.name}</Typography.Text>
			<Avatar src={authorImageUrl} />
		</div>
	);
}
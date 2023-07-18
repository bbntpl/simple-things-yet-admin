import React from 'react';
import { Button } from 'antd';
import { useNavigate } from 'react-router-dom';

const TagItem = ({ tag }) => {
	const { name, slug, blogs } = tag;
	const navigate = useNavigate();

	const navigateToBlogsUnderTagPage = () => {
		navigate(`../tag/${slug}`);
	};

	return (
		<Button
			style={{
				minWidth: '50px',
				borderRadius: '5px',
				border: '1px solid #ccc',
				padding: '5px',
				margin: '5px'
			}}
			onClick={navigateToBlogsUnderTagPage}
		>
			<span style={{ marginRight: '5px' }}>{name}</span>
			<strong>{blogs.length}</strong>
		</Button>
	);
};

export default TagItem;

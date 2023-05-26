import React from 'react';
import { Button } from 'antd';
import { useNavigate } from 'react-router-dom';

const CategoryItem = ({ category }) => {
	const { name, blogs } = category;
	const navigate = useNavigate();

	const navigateToCategory = () => {
		navigate(`./category/${name}`);
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
			onClick={navigateToCategory}
		>
			<span style={{ marginRight: '5px' }}>{name}</span>
			<strong>{blogs.length}</strong>
		</Button>
	);
};

export default CategoryItem;

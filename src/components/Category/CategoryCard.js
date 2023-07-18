import React, { useEffect, useState } from 'react';
import { Card, Skeleton } from 'antd';
import { useNavigate } from 'react-router-dom';
import { fetchCategoryImageRequest } from '../../services/categoryAPI';

const cardStyle = { width: '100%', maxWidth: '300px', margin: '10px' }

const CategoryCard = ({ category }) => {
	const navigate = useNavigate();
	const [image, setImage] = useState(null);
	const [hasImageLoaded, setHasImageLoaded] = useState(false);

	// Fetch the category image on mount
	useEffect(() => {
		const fetchImage = async () => {
			const imageUrl = await fetchCategoryImageRequest(category.imageId);
			setImage(imageUrl);
			setHasImageLoaded(true);
		};

		if (category?.imageId) {
			fetchImage();
		} else {
			setHasImageLoaded(true);
		}
	}, [category.imageId]);

	const onCardClick = () => {
		navigate(`/categories/${category.slug}`);
	};
	console.log(image);
	if (hasImageLoaded) {
		return (
			<Card
				hoverable
				style={cardStyle}
				cover={<img alt={category.name} src={image} />}
				onClick={onCardClick}
			>
				<Card.Meta
					title={category.name}
					description={category.description}
				/>
			</Card>
		);
	} else {
		return (
			<Skeleton style={cardStyle} active />
		)
	}
}

export default CategoryCard;

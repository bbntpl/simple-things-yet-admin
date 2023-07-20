import { Card } from 'antd';
import Paragraph from 'antd/es/typography/Paragraph';
import { useNavigate } from 'react-router-dom';

const CategoryCard = ({ category }) => {
	const navigate = useNavigate();

	const onCardClick = () => {
		navigate(`../category/${category.slug}`);
	};

	const onLoad = () => {
		console.log('loaded');
	}

	const onError = () => {
		console.log('error');
	}

	return (
		<Card
			hoverable
			className='category-card'
			cover={category?.imageId
				?
				<div style={{ maxHeight: '140px', overflow: 'hidden' }}>
					<img
						style={{ width: '100%', height: 'auto' }}
						alt={category.name}
						src={`${process.env.REACT_APP_API_URL}/categories/image/${category.imageId}`}
						loading='lazy'
						onLoad={onLoad}
						onError={onError}
					/>
				</div>
				: null}
			onClick={onCardClick}
		>
			<Card.Meta
				title={category.name}
				description={
					<Paragraph
						style={{
							margin: '0 0 2rem 0', color: 'gray'
						}}
						ellipsis={{ rows: 5, expandable: false }}
					>
						{category.description}
					</Paragraph>}
			/>
		</Card>
	);
}

export default CategoryCard;

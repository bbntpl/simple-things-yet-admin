import { Card } from 'antd';
import Paragraph from 'antd/es/typography/Paragraph';
import { useNavigate } from 'react-router-dom';
import { getImageUrl } from '../../services/helper';

const CategoryCard = ({ category }) => {
	const navigate = useNavigate();

	const onCardClick = () => {
		navigate(`../category/${category.slug}`);
	};

	const onError = () => {
		console.log('error');
	}

	return (
		<Card
			hoverable
			className='category-card'
			cover={category?.imageFile
				?
				<div style={{ maxHeight: '140px', overflow: 'hidden' }}>
					<img
						style={{ width: '100%', height: 'auto' }}
						alt={category.name}
						src={getImageUrl(category.imageFile)}
						loading='lazy'
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

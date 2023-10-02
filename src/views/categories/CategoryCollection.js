import { useEffect } from 'react';
import { Col, Row, Spin } from 'antd';
import { useDispatch, useSelector } from 'react-redux';

import CategoryCard from '../../components/Category/CategoryCard';
import { fetchCategories, selectCategories } from '../../redux/sliceReducers/categoriesSlice';
import Title from 'antd/es/typography/Title';
import { Link } from 'react-router-dom';

const CategoryCollection = () => {
	const dispatch = useDispatch();
	const categoryStatus = useSelector(state => state.categories.status);
	const categories = useSelector(selectCategories);

	useEffect(() => {
		if (categoryStatus === 'idle') {
			dispatch(fetchCategories());
		}
	}, [dispatch, categoryStatus])

	if (categoryStatus !== 'succeeded') return <Spin />

	return <div>
		<Title style={{ marginBottom: '3rem' }} level={3}>Blog Categories</Title>
		{
			!categories.length ?
				<div>
					<p>
						No categories yet
					</p>
					<Link to='../create-category'>
						Click here to create a new category
					</Link>
				</div> : null
		}
		<Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }} className='flex-row'>
			{
				categories.map(category => (
					<Col className='gutter-row flex-col' span={24} sm={12} md={8} lg={6} key={category.id}>
						<CategoryCard category={category} key={category.id} />
					</Col>
				))
			}
		</Row>
	</div >
}

export default CategoryCollection;
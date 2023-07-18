import { useEffect } from 'react';
import { Spin } from 'antd';
import { useDispatch, useSelector } from 'react-redux';

import CategoryCard from '../../components/Category/CategoryCard';
import { fetchCategories, selectCategories } from '../../redux/sliceReducers/categoriesSlice';
import Title from 'antd/es/typography/Title';

const CategoryCollection = () => {
	const dispatch = useDispatch();
	const categories = useSelector(selectCategories);

	useEffect(() => {
		dispatch(fetchCategories());
	}, [dispatch])

	if (!Array.isArray(categories)) {
		return <Spin />
	}

	return <div>
		<Title level={3}>Blog Categories</Title>
		{
			categories.map(category => (
				<CategoryCard category={category} key={category.id} />
			))
		}
	</div>

}

export default CategoryCollection;
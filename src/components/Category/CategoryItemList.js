import { Space } from 'antd';
import CategoryItem from './CategoryItem';

export default function CategoryItemList({ categories }) {
	return <Space wrap>
		{
			categories.map(cat => {
				return <CategoryItem key={cat.id} category={cat} />
			})
		}
	</Space>
}
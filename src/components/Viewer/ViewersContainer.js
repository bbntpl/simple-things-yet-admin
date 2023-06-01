import { Space } from 'antd';

import ViewerCard from './ViewerCard';
import Title from 'antd/es/typography/Title';

export default function ViewersContainer({ viewers }) {
	return <div>
		<Title level={3}>Viewers</Title>
		<Space wrap size='small'>
			{
				viewers?.length > 0 ? viewers.map(viewer => (
					< ViewerCard key={viewer.id} viewer={viewer} />
				)) : <p>You have no viewers yet.</p>
			}
		</Space>
	</div>
}
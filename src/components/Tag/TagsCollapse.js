import { Collapse } from 'antd';
import TagItemList from './TagItemList';

export default function TagsCollapse(props) {
	const { collapseSize, tags, headerName } = props;
	return (
		<Collapse size={collapseSize}>
			<Collapse.Panel header={headerName}>
				<TagItemList tags={tags} />
			</Collapse.Panel>
		</Collapse>
	)
}
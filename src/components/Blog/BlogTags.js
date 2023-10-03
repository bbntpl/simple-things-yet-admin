import { Space, Tag } from 'antd';

const containerStyles = {
	marginBottom: '1.5rem',
}

export default function BlogTags({ tags }) {
	return (
		<div style={containerStyles}>
			<Space wrap>
				{tags.map(tag => (
					<Tag color='blue' key={tag.id}>{tag.name}</Tag>
				))}
			</Space>
		</div>
	)
}
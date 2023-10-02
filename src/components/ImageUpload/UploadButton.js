import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';

export default function UploadButton({ isImageLoading }) {
	return (
		<div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
			<div>
				{isImageLoading ? <LoadingOutlined /> : <PlusOutlined />}
				<div style={{ marginTop: 8 }}>Upload</div>
			</div>
		</div>
	)
};
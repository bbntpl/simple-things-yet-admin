import { Button, Modal, Upload } from 'antd';
import { DeleteFilled, EyeOutlined } from '@ant-design/icons';

import openNotification from '../../lib/openNotification';
import UploadedImage from './UploadedImage';

import { areUploadReqsMet, getBase64 } from '../../helpers/file-handling';

const uploadButtonsStyles = {
	display: 'flex',
	gap: '1px 10px',
	margin: '2px 7px',
	justifyContent: 'center'
}

export default function ImageUpload(props) {
	const {
		uploadedImage,
		updateUploadedImage,
		uploadElName,
	} = props;

	const {
		isLoading,
		previewTitle,
		isPreviewOpen,
		url,
		file,
	} = uploadedImage;

	const validateAndProcessFile = (file) => {

		// If the upload requirements weren't met then return false
		if (!areUploadReqsMet(file)) {
			resetUpload();
			return false;
		}
		// Otherwise, convert to base64 and set image URL/file
		getBase64(file, (url) => {
			updateUploadedImage({
				isLoading: false,
				url,
				file
			})
		});
		return false;
	}

	const resetUpload = () => {
		updateUploadedImage({
			loading: false,
			url: null,
			file: null
		});
	}

	const handleUploadChange = (info) => {
		if (info.file.status === 'error') {
			resetUpload();
			openNotification({
				type: 'error',
				message: 'Operation failed',
				description: 'Something went wrong with the image upload',
			})
		}

		if (info.file.status === 'uploading') {
			updateUploadedImage({ imageLoading: true });
		}
	};

	const handlePreview = () => {
		updateUploadedImage({
			isPreviewOpen: true,
			previewTitle: file.name || file.url.substring(file.url.lastIndex('/') + 1)
		});
	}

	return <>
		<Upload
			name={uploadElName}
			listType='picture-card'
			showUploadList={false}
			beforeUpload={validateAndProcessFile}
			onRemove={() => resetUpload()}
			onChange={handleUploadChange}
		>
			<UploadedImage
				imageUrl={url}
				imageAltName={uploadElName}
				imageLoading={isLoading}
			/>
		</Upload>
		{
			file && <div style={uploadButtonsStyles}>
				< Button style={{}} onClick={() => handlePreview()}>
					<EyeOutlined style={{ color: 'gray' }} />
				</Button>
				< Button style={{}} onClick={() => resetUpload()}>
					<DeleteFilled style={{ color: 'red' }} />
				</Button>
			</div>
		}
		<Modal
			open={isPreviewOpen}
			title={previewTitle}
			footer={null}
			onCancel={() => updateUploadedImage({ isPreviewOpen: false })}
		>
			<img alt='cover' style={{ width: '100%' }} src={url} />
		</Modal>
	</>
}
import { Button, Divider, Form, Modal, Space, Upload } from 'antd';
import { DeleteFilled, EyeOutlined } from '@ant-design/icons';

import openNotification from '../../lib/openNotification';
import UploadedImage from './UploadedImage';

import { areUploadReqsMet, getBase64 } from '../../helpers/file-handling';
import ImagesDrawer from './ImagesDrawer';
import { useState } from 'react';

const uploadButtonsStyles = {
	display: 'flex',
	gap: '1px 10px',
	margin: '2px 7px',
	justifyContent: 'center'
}

export default function ImageUpload(props) {
	const {
		formItemLabel,
		uploadedImage,
		uploadedImageSetters,
		uploadElName,
		showImagesDb = true
	} = props;

	const {
		isLoading,
		previewTitle,
		isPreviewOpen,
		url,
		file,
		existingImageId
	} = uploadedImage;

	const [isDrawerOpen, setIsDrawerOpen] = useState(false);
	const isExistingImageUploaded = url && existingImageId;

	const openDrawer = () => setIsDrawerOpen(true);
	const closeDrawer = () => setIsDrawerOpen(false);

	const validateAndProcessFile = (file) => {
		// If the upload requirements weren't met then return false
		if (!areUploadReqsMet(file)) {
			resetUpload();
			return false;
		}

		// Otherwise, convert to base64 and set image URL/file
		getBase64(file, (url) => {
			uploadedImageSetters.update({
				isLoading: false,
				url,
				file,
				existingImageId: null,
				previewTitle: file.name || file.url.substring(file.url.lastIndex('/') + 1)
			})
		});
		return false;
	}

	const resetUpload = () => {
		uploadedImageSetters.update({
			isLoading: false,
			url: null,
			file: null,
			existingImageId: null,
			previewTitle: ''
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
			uploadedImageSetters.update({ isLoading: true, existingImageId: null });
		}
	};

	const handlePreview = () => {
		uploadedImageSetters.update({ isPreviewOpen: true });
	}

	return <>
		<Form.Item
			label={formItemLabel}
			style={{ width: 'max-content' }}
		>
			<Space direction='vertical'>
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
					(file || isExistingImageUploaded) && <div style={uploadButtonsStyles}>
						< Button style={{}} onClick={() => handlePreview()}>
							<EyeOutlined style={{ color: 'gray' }} />
						</Button>
						< Button style={{}} onClick={() => resetUpload()}>
							<DeleteFilled style={{ color: 'red' }} />
						</Button>
					</div>
				}
			</Space>
			{showImagesDb && <>
				<Divider>OR</Divider>
				<Button onClick={openDrawer}>Choose an existing image from db</Button>
			</>
			}
		</Form.Item >
		<Modal
			open={isPreviewOpen}
			title={previewTitle}
			footer={null}
			onCancel={() => uploadedImageSetters.update({ isPreviewOpen: false })}
		>
			<img alt='cover' style={{ width: '100%' }} src={url} />
		</Modal>
		<ImagesDrawer
			isDrawerOpen={isDrawerOpen}
			closeDrawer={closeDrawer}
			addExistingImage={uploadedImageSetters.addExistingImage}
		/>
	</>
}
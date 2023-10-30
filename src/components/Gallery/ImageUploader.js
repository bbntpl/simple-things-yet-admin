import { Button, Form, Space, Upload } from 'antd';
import ImageCreditFieldset from '../ImageUpload/ImageCreditFieldset';
import { createImageFileDocRequest } from '../../services/imageDocAPI';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectToken } from '../../redux/sliceReducers/loggedAuthorSlice';
import { imageDocAdded } from '../../redux/sliceReducers/imageDocsSlice';
import openNotification, { notifyError } from '../../lib/openNotification';
import { UploadOutlined } from '@ant-design/icons';
import UploadedImage from '../ImageUpload/UploadedImage';
import useImageUpload from '../../hooks/useImageUpload';

function ImageUploader() {
	const [form] = Form.useForm();
	const dispatch = useDispatch();
	const authorToken = useSelector(selectToken);

	const [uploadedImage, uploadedImageSetters] = useImageUpload();
	const [isDataSubmitting, setIsDataSubmitting] = useState(false);

	const createImageDoc = async (values) => {
		setIsDataSubmitting(true);
		try {
			const formData = new FormData();
			formData.append('credit', JSON.stringify(values));
			formData.append('bs', 'you are reading this');
			const data = await createImageFileDocRequest(formData, authorToken)

			dispatch(imageDocAdded(data));
			openNotification({
				type: 'success',
				message: 'Successful operation',
				description: 'Image document is successfully created',
			});
		} catch (error) {
			notifyError(error);
		} finally {
			setIsDataSubmitting(false);
		}
	}

	return (
		<div className='image-to-db'>
			<Space className='image-to-db__upload' direction='vertical' size='large'>
				<UploadedImage
					imageUrl={uploadedImage}
					imageAltName={uploadedImageSetters.update}
					imageLoading={'uploadImage'}
				/>
				<Upload maxCount={1} name='uploadImage'>
					<Button icon={<UploadOutlined />}>Click to upload</Button>
				</Upload>
			</Space>
			<div className='image-to-db__credit'>
				<ImageCreditFieldset
					loading={isDataSubmitting}
					handleSubmit={createImageDoc}
					form={form}
				/>
			</div>
		</div>
	)
}

export default ImageUploader;
import { Form, Space } from 'antd';
import ImageCreditForm from '../Gallery/ImageCreditForm';
import { createImageFileDocRequest } from '../../services/imageDocAPI';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectToken } from '../../redux/sliceReducers/loggedAuthorSlice';
import { imageDocAdded } from '../../redux/sliceReducers/imageDocsSlice';
import openNotification, { notifyError } from '../../lib/openNotification';
import useImageUpload from '../../hooks/useImageUpload';
import ImageUpload from '../ImageUpload';

function ImageUploader() {
	const [form] = Form.useForm();
	const dispatch = useDispatch();
	const authorToken = useSelector(selectToken);

	const [errors, setErrors] = useState([]);
	const [uploadedImage, uploadedImageSetters] = useImageUpload();
	const [isDataSubmitting, setIsDataSubmitting] = useState(false);
	const [submittable, setSubmittable] = useState(false);

	useEffect(() => {
		if (!uploadedImage.file) {
			setSubmittable(false);
		} else {
			setSubmittable(true);
		}
	}, [uploadedImage.file])

	const clearForm = () => {
		if (errors.length > 0) {
			setErrors([]);
		}
		form.resetFields();
		uploadedImageSetters.reset();
	}

	const createImageDoc = async (values) => {
		setIsDataSubmitting(true);
		try {
			const data = await createImageFileDocRequest({
				credit: values,
				file: uploadedImage.file,
				token: authorToken
			})
			if (data && data?.errors) {
				setErrors(
					data.errors.map(error => (`- ${error.path.split('.')[1]}: ${error.msg}`))
				);
			} else {
				dispatch(imageDocAdded(data));
				openNotification({
					type: 'success',
					message: 'Successful operation',
					description: 'Image document is successfully created',
				});
				clearForm();
			}
		} catch (error) {
			notifyError(error);
		} finally {
			setIsDataSubmitting(false);
		}
	}

	return (
		<div className='image-to-db'>
			<Space className='image-to-db__upload' direction='vertical' size='large'>
				<ImageUpload
					uploadedImage={uploadedImage}
					updateUploadedImage={uploadedImageSetters.update}
					uploadElName='uploadImage'
				/>
			</Space>
			<div className='image-to-db__credit'>
				<ImageCreditForm
					form={form}
					handleSubmit={createImageDoc}
					handleReset={clearForm}
					loading={isDataSubmitting}
					disabled={!submittable}
					errors={errors}
				/>
			</div>
		</div>
	)
}

export default ImageUploader;
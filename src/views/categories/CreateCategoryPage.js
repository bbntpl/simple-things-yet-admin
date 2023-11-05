import { useDispatch, useSelector } from 'react-redux';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form } from 'antd';

import { createCategoryRequest } from '../../services/categoryAPI';
import { selectToken } from '../../redux/sliceReducers/loggedAuthorSlice';
import { categoryAdded } from '../../redux/sliceReducers/categoriesSlice';
import { notifyError, notifySuccess } from '../../lib/openNotification';
import CategoryForm from '../../components/Category/CategoryForm';
import useImageUpload from '../../hooks/useImageUpload';

function CreateCategoryPage() {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const authorToken = useSelector(selectToken);

	const [isDataSubmitting, setIsDataSubmitting] = useState(false);
	const [errors, setErrors] = useState([]);
	const [uploadedImage, uploadedImageSetters] = useImageUpload();
	const [form] = Form.useForm();

	const handleSubmit = async (values) => {
		setIsDataSubmitting(true);
		try {
			const data = await createCategoryRequest({
				name: values.name,
				description: values?.description || '',
				credit: {
					authorName: values?.authorName || '',
					authorURL: values?.authorURL || '',
					sourceName: values?.sourceName || '',
					sourceURL: values?.sourceURL || ''
				},
				file: uploadedImage.file,
				existingImageId: uploadedImage.existingImageId
			}, authorToken);
			if (data && data.errors) {
				setErrors(data.errors.map(error => error.msg));
			} else if (data && data.error) {
				setErrors([data.error]);
			} else if (data && !data.error && !data.errors) {
				dispatch(categoryAdded(data));
				navigate('/dashboard');
				notifySuccess(`New category "${data.name}" is successfully submitted`);
			}
		} catch (error) {
			notifyError(error);
		} finally {
			setIsDataSubmitting(false);
		}
	};

	return <CategoryForm
		handleSubmit={handleSubmit}
		form={form}
		uploadedImage={uploadedImage}
		uploadedImageSetters={uploadedImageSetters}
		isDataSubmitting={isDataSubmitting}
		errors={errors}
	/>
}

export default CreateCategoryPage;
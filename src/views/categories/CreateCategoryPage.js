import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Form } from 'antd';

import { createCategoryRequest } from '../../services/categoryAPI';
import { selectToken } from '../../redux/sliceReducers/loggedAuthorSlice';
import { categoryAdded } from '../../redux/sliceReducers/categoriesSlice';
import openNotification, { notifyError } from '../../lib/openNotification';
import CategoryForm from '../../components/Category/CategoryForm';
import { useState } from 'react';
import useImageUpload from '../../hooks/useImageUpload';

function CreateCategoryPage() {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const authorToken = useSelector(selectToken);

	const [isDataSubmitting, setIsDataSubmitting] = useState(false);
	const [uploadedImage, uploadedImageSetters] = useImageUpload();
	const [form] = Form.useForm();

	const handleSubmit = async (values) => {
		setIsDataSubmitting(true);
		try {
			const formData = new FormData();
			formData.append('name', values.name);
			formData.append('description', values.description || '');
			if (uploadedImage.file) {
				formData.append('categoryImage', uploadedImage.file);
			}
			const data = await createCategoryRequest(formData, authorToken);

			if (data && data.errors) {
				form.setFields(
					data.errors.map(error => ({ name: error.param, errors: [error.msg] }))
				);
			} else if (data && data.error) {
				form.setFields([{ name: 'name', errors: [data.error] }]);
			} else if (data && !data.error && !data.errors) {
				dispatch(categoryAdded(data));
				navigate('/dashboard');
				openNotification({
					type: 'success',
					message: 'Successful operation',
					description: `New category "${data.name}" is successfully submitted`,
				});
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
	/>
}

export default CreateCategoryPage;
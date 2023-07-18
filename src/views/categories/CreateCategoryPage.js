import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Form } from 'antd';

import { createCategoryRequest } from '../../services/categoryAPI';
import { selectToken } from '../../redux/sliceReducers/loggedAuthorSlice';
import { createCategoryReducer } from '../../redux/sliceReducers/categoriesSlice';
import openNotification, { notifyError } from '../../lib/openNotification';
import CategoryForm from '../../components/Category/CategoryForm';
import { useState } from 'react';

function CreateCategoryPage() {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const authorToken = useSelector(selectToken);

	const [isLoading, setIsLoading] = useState(false);
	const [file, setFile] = useState(null);
	const [form] = Form.useForm();
	console.log('rendered category creation form');
	const handleSubmit = async (values) => {
		setIsLoading(true);
		setTimeout(() => {
			const formData = new FormData();
			formData.append('name', values.name);
			formData.append('description', values.description);
			if (file) {
				formData.append('categoryImage', file);
			}

			createCategoryRequest(formData, authorToken)
				.then(data => {
					if (data && data.errors) {
						setIsLoading(false);
						form.setFields(
							data.errors.map(error => ({ name: error.param, errors: [error.msg] }))
						);
					} else if (data && data.error) {
						setIsLoading(false);
						form.setFields([{ name: 'name', errors: [data.error] }]);
					} else if (data && !data.error && !data.errors) {
						dispatch(createCategoryReducer(data));
						navigate('/dashboard');
						openNotification({
							type: 'success',
							message: 'Successful operation',
							description: `New category "${data.name}" is successfully submitted`,
						});
					}
				}).catch(error => {
					setIsLoading(false);
					notifyError(error);
				});
		}, 500);
	};

	return <CategoryForm
		handleSubmit={handleSubmit}
		file={file}
		setFile={setFile}
		form={form}
		isLoading={isLoading}
	/>
}

export default CreateCategoryPage;
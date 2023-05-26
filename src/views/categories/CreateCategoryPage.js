import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Form } from 'antd';

import { createCategoryRequest } from '../../services/categoryAPI';
import { selectToken } from '../../redux/sliceReducers/loggedAuthorSlice';
import { createCategoryReducer } from '../../redux/sliceReducers/categoriesSlice';
import openNotification from '../../lib/openNotification';
import CategoryForm from '../../components/Category/CategoryForm';
import { useState } from 'react';

function CreateCategoryPage() {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const authorToken = useSelector(selectToken);
	const [isLoading, setIsLoading] = useState(false);
	const [form] = Form.useForm();

	const handleSubmit = async (values) => {
		setIsLoading(true);
		try {
			const response = await createCategoryRequest(values, authorToken);

			if (!!response?.errors) {
				setIsLoading(false);
				form.setFields(
					response.errors.map(error => ({ name: error.param, errors: [error.msg] }))
				);
			} else if (!!response?.error) {
				setIsLoading(false);
				form.setFields([{ name: 'name', errors: [response?.error] }]);
			} else {
				setTimeout(() => {
					dispatch(createCategoryReducer(values));
					navigate('/dashboard');
					openNotification({
						type: 'success',
						message: 'Successful operation',
						description: `New category "${values.name}" is successfully submitted`,
					});
				}, 1100)
			}
		} catch (error) {
			setIsLoading(false);
			form.setFields([{ name: 'name', errors: ['An error occurred while submitting the form.'] }]);
		}
	};

	return <CategoryForm
		handleSubmit={handleSubmit}
		form={form}
		isLoading={isLoading}
	/>
}

export default CreateCategoryPage;
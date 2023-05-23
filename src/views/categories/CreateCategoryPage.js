import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, Typography } from 'antd';

import { createCategoryRequest } from '../../services/categoryAPI';
import { selectToken } from '../../redux/sliceReducers/loggedAuthorSlice';
import { createCategoryReducer } from '../../redux/sliceReducers/categoriesSlice';
import openNotification from '../../lib/openNotification';

const { Title } = Typography;

function CreateCategoryPage() {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const authorToken = useSelector(selectToken);
	const [form] = Form.useForm();

	const handleSubmit = async (values) => {
		try {
			const response = await createCategoryRequest(values, authorToken);

			if (!!response?.errors) {
				form.setFields(
					response.errors.map(error => ({ name: error.param, errors: [error.msg] }))
				);
			} else if (!!response?.error) {
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
				}, 1100);
			}
		} catch (error) {
			console.log(error);
			form.setFields([{ name: 'name', errors: ['An error occurred while submitting the form.'] }]);
		}
	};

	return (
		<div>
			<Form layout='vertical' form={form} onFinish={handleSubmit}>
				<Title level={3}>Create a new category label for blog</Title>
				<Form.Item
					label='Category Name'
					name='name'
					rules={[{ required: true, message: 'Input for Category Name is required' }]}
				>
					<Input />
				</Form.Item>
				<Form.Item
					label='Category Description'
					name='description'
				>
					<Input.TextArea />
				</Form.Item>
				<Form.Item>
					<Button type='primary' htmlType='submit'>
						Add category
					</Button>
				</Form.Item>
			</Form>
		</div>
	);
}

export default CreateCategoryPage;
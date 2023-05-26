import { Form, Typography, Button, Input } from 'antd';
import { useEffect } from 'react';

const { Title } = Typography;

export default function CategoryForm(props) {
	const {
		isEditing = false,
		category = null,
		handleSubmit,
		form,
		isLoading
	} = props;

	useEffect(() => {
		if (isEditing && category) {
			const { name, description } = category;
			form.setFieldValue({ name, description });
		}
	}, [isEditing, category, form])

	return (
		<div>
			<Form layout='vertical' form={form} onFinish={handleSubmit}>
				<Title level={3}>
					{isEditing ? 'Edit category'
						: 'Create a new category label for blog'}
				</Title>
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
					<Button type='primary' htmlType='submit' loading={isLoading}>
						{`${isEditing ? 'Update' : 'Add'} category`}
					</Button>
				</Form.Item>
			</Form>
		</div>
	);
}
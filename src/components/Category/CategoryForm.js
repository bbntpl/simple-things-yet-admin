import { Form, Typography, Button, Input, Space, Popconfirm, Row, Col } from 'antd';
import { useEffect } from 'react';
import { deleteCategoryRequest } from '../../services/categoryAPI';
import openNotification, { notifyError } from '../../lib/openNotification';
import { useDispatch, useSelector } from 'react-redux';
import { selectToken } from '../../redux/sliceReducers/loggedAuthorSlice';
import { deleteCategoryReducer } from '../../redux/sliceReducers/categoriesSlice';
import { useNavigate } from 'react-router-dom';

const { Title } = Typography;

export default function CategoryForm(props) {
	const {
		isEditing = false,
		category = null,
		handleSubmit,
		form,
		isLoading
	} = props;

	const navigate = useNavigate();
	const dispatch = useDispatch();
	const authorToken = useSelector(selectToken);
	const areThereBlogs = category?.blogs.length

	useEffect(() => {
		if (isEditing && category) {
			const { name, description } = category;
			form.setFieldValue({ name, description });
		}
	}, [isEditing, category, form])

	function handleCategoryDeletion(categoryId) {
		return async () => {
			try {
				await deleteCategoryRequest(categoryId, authorToken);
				dispatch(deleteCategoryReducer(categoryId));
				navigate('/blogs');
				openNotification({
					type: 'success',
					description: 'Category successfully deleted'
				})
			} catch (error) {
				notifyError(error)
			}
		}
	}
	return (
		<div>
			{
				isEditing &&
				<Space wrap direction='horizontal'>
					<Popconfirm
						title={`Delete the category "${category?.name}"`}
						description='Are you sure you want to delete this category?'
						onConfirm={handleCategoryDeletion(category?.id)}
						okText='Yes'
						cancelText='No'
					>
						<Button
							danger
							disabled={areThereBlogs}
						>
							Delete the category
						</Button>
					</Popconfirm>
					{areThereBlogs ? <strong>
						You must delete all of {category?.name}-related blogs before category deletion.
					</strong> : null}
				</Space>
			}
			<Row justify='center'>
				<Col xs={24} sm={24} md={18} lg={12}>
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
				</Col>
			</Row>
		</div >
	);
}
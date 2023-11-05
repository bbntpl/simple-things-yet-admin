import { Form, Typography, Button, Input, Space, Popconfirm, Row, Col } from 'antd';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { notifyError, notifySuccess } from '../../lib/openNotification';

import { deleteCategoryRequest } from '../../services/categoryAPI';
import { selectToken } from '../../redux/sliceReducers/loggedAuthorSlice';
import { categoryDeleted } from '../../redux/sliceReducers/categoriesSlice';
import ImageUploadFormItem from '../ImageUploadFormItem';

const { Title } = Typography;

export default function CategoryForm(props) {
	const {
		isEditing = false,
		category = null, //category object/values
		handleSubmit,
		form,
		isDataSubmitting,
		uploadedImage,
		uploadedImageSetters,
		errors
	} = props;

	const navigate = useNavigate();
	const dispatch = useDispatch();
	const authorToken = useSelector(selectToken);

	const areThereBlogs = category?.blogs?.length || 0;

	function handleCategoryDeletion(categoryId) {
		return async () => {
			try {
				await deleteCategoryRequest(categoryId, authorToken);
				dispatch(categoryDeleted(categoryId));
				navigate('/categories');
				notifySuccess('Category successfully deleted');
			} catch (error) {
				notifyError(error)
			}
		}
	}

	useEffect(() => {
		if (isEditing && category) {
			// set form fields with corresponding values from the category
			const fieldsToBeEdited = [
				{ name: 'name', value: category.name },
				{ name: 'description', value: category.description },
			];
			form.setFields(fieldsToBeEdited);
		}
	}, [isEditing, category, form])

	return (
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
					<Form.Item label='Category Description' name='description'>
						<Input.TextArea />
					</Form.Item>
					<ImageUploadFormItem
						formItemLabel='Upload cover image'
						uploadedImageSetters={uploadedImageSetters}
						uploadedImage={uploadedImage}
						uploadElName='categoryImage'
						document={category}
						form={form}
					/>
					<Form.ErrorList errors={errors} />
					<Form.Item>
						<Button
							type='primary'
							htmlType='submit'
							loading={isDataSubmitting}
							disabled={uploadedImage.isLoading}
						>
							{`${isEditing ? 'Update' : 'Add'} category`}
						</Button>
					</Form.Item>
				</Form>
				{
					isEditing &&
					<Space wrap direction='horizontal'>
						<Popconfirm
							title={`Delete the category "${category?.name}"`}
							description='Are you sure you want to delete this category?'
							onConfirm={handleCategoryDeletion(category?.id)}
							okText='Yes'
							cancelText='No'
							disabled={areThereBlogs}
						>
							<Button danger disabled={areThereBlogs}>
								Delete the category
							</Button>
						</Popconfirm>
						{areThereBlogs ? <strong>
							You must delete all of {category?.name}-related blogs before category deletion.
						</strong> : null}
						{areThereBlogs > 0
							? <p style={{ color: 'gray' }}>Total blogs(drafts/published): {category.blogs.length}</p> : null}
					</Space>
				}
			</Col>
		</Row>
	);
}
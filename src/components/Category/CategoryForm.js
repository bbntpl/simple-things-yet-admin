import { Form, Typography, Button, Input, Space, Popconfirm, Row, Col } from 'antd';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import ImageUpload from '../ImageUpload';
import openNotification, { notifyError } from '../../lib/openNotification';

import { deleteCategoryRequest } from '../../services/categoryAPI';
import { getImageUrl } from '../../services/helper';
import { selectToken } from '../../redux/sliceReducers/loggedAuthorSlice';
import { categoryDeleted } from '../../redux/sliceReducers/categoriesSlice';

const { Title } = Typography;

export default function CategoryForm(props) {
	const {
		isEditing = false,
		category = null,
		handleSubmit,
		form,
		isDataSubmitting,
		uploadedImage,
		uploadedImageSetters,
	} = props;

	const navigate = useNavigate();
	const dispatch = useDispatch();
	const authorToken = useSelector(selectToken);
	const areThereBlogs = category?.blogs?.length || 0;

	useEffect(() => {
		if (isEditing && category) {
			if (category.imageId) {
				const initializeExistingImageAndFile = async () => {
					const imageUrl = getImageUrl(`/categories/${category.imageId}/image`);
					await uploadedImageSetters.downloadImageAndUpdateSources(imageUrl);
				}

				initializeExistingImageAndFile();
			}
			// set form fields with corresponding values from the category
			const fieldsToBeEdited = [
				{ name: 'name', value: category.name },
				{ name: 'description', value: category.description },
			];
			form.setFields(fieldsToBeEdited);
		}
	}, [isEditing, category, form])

	function handleCategoryDeletion(categoryId) {
		return async () => {
			try {
				await deleteCategoryRequest(categoryId, authorToken);
				dispatch(categoryDeleted(categoryId));
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
					<Form.Item
						label='Upload cover image'
						style={{ width: 'max-content' }}
					>
						<ImageUpload
							uploadedImage={uploadedImage}
							updateUploadedImage={uploadedImageSetters.update}
							uploadElName='categoryImage'
						/>
					</Form.Item>
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
						{areThereBlogs > 0
							? <p style={{ color: 'gray' }}>Total blogs(drafts/published): {category.blogs.length}</p> : null}
					</Space>
				}
			</Col>
		</Row>
	);
}
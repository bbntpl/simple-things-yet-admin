import { Form, Typography, Button, Input, Space, Popconfirm, Row, Col } from 'antd';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import openNotification, { notifyError } from '../../lib/openNotification';

import { deleteCategoryRequest } from '../../services/categoryAPI';
import { selectToken } from '../../redux/sliceReducers/loggedAuthorSlice';
import { categoryDeleted } from '../../redux/sliceReducers/categoriesSlice';
import ImageUploadFormItem from '../ImageUploadFormItem';
import { fetchImageFileDocRequest } from '../../services/imageDocAPI';
import { selectImageDoc } from '../../redux/sliceReducers/imageDocsSlice';

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
	const categoryImageDoc = useSelector(selectImageDoc(category.imageFile));
	const [uploadedImageDoc, setUploadedImageDoc] = useState(categoryImageDoc);

	const areThereBlogs = category?.blogs?.length || 0;

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

	async function updateImageDoc(imageId) {
		const result = await fetchImageFileDocRequest(imageId);
		setUploadedImageDoc(result);
	}

	useEffect(() => {
		try {
			(async () => await updateImageDoc(uploadedImage.existingImageId))();
			console.log(uploadedImageDoc);
			form.setFieldsValue({
				authorName: uploadedImageDoc?.credit.authorName || '',
				authorURL: uploadedImageDoc?.credit.authorURL || '',
				sourceName: uploadedImageDoc?.credit.sourceName || '',
				sourceURL: uploadedImageDoc?.credit.sourceURL || ''
			});

		} catch (error) {
			throw new Error(error.message);
		}
	}, [uploadedImage])

	useEffect(() => {
		if (isEditing && category) {
			// set form fields with corresponding values from the category
			const fieldsToBeEdited = [
				{ name: 'name', value: category.name },
				{ name: 'description', value: category.description },
			];
			form.setFields(fieldsToBeEdited);

			// Set image doc object derived from uploaded image if it exists
			// if (category.imageFile) {
			// 	(async () => await updateImageDoc(category.imageFile))();
			// }
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
					/>
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
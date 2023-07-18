import { Form, Typography, Button, Input, Space, Popconfirm, Row, Col, Upload, Modal } from 'antd';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { deleteCategoryRequest, fetchCategoryImageRequest } from '../../services/categoryAPI';
import openNotification, { notifyError } from '../../lib/openNotification';
import { selectToken } from '../../redux/sliceReducers/loggedAuthorSlice';
import { deleteCategoryReducer } from '../../redux/sliceReducers/categoriesSlice';
import { DeleteFilled, EyeOutlined, LoadingOutlined, PlusOutlined } from '@ant-design/icons';

const { Title } = Typography;

const areUploadReqsMet = (file) => {
	const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
	if (!isJpgOrPng) {
		notifyError({ messsage: 'You can only upload JPG/PNG file!' });
	}
	const isLt2M = file.size / 1024 / 1024 < 2;
	if (!isLt2M) {
		notifyError({ message: 'Image must be smaller than 2MB' })
	}
	return isJpgOrPng && isLt2M;
};

const getBase64 = (img, callback) => {
	const reader = new FileReader();
	reader.addEventListener('load', () => callback(reader.result));
	reader.readAsDataURL(img);
};

export default function CategoryForm(props) {
	const {
		isEditing = false,
		category = null,
		handleSubmit,
		form,
		isLoading,
		file,
		setFile
	} = props;

	const navigate = useNavigate();
	const dispatch = useDispatch();
	const authorToken = useSelector(selectToken);
	const areThereBlogs = category?.blogs.length;
	const [loading, setLoading] = useState(false);
	const [previewTitle, setPreviewTitle] = useState('');
	const [previewOpen, setPreviewOpen] = useState(false);
	const [imageURL, setImageURL] = useState();

	useEffect(() => {
		if (isEditing && category) {
			const { name, description, imageId } = category;
			if (imageId) {
				fetchCategoryImageRequest(imageId).then(file => {
					form.setFieldValue({
						name,
						description,
						categoryImage: file
					});
				})
			} else {
				form.setFieldValue({
					name,
					description,
				});
			}
		}
	}, [isEditing, category, form])

	const resetUpload = () => {
		setLoading(false);
		setFile(false);
		setImageURL();
	}

	const handleUploadChange = (info) => {
		if (info.file.status === 'error') {
			resetUpload();
			openNotification({
				type: 'error',
				message: 'Operation failed',
				description: 'Something went wrong with the upload',
			})
		}

		if (info.file.status === 'uploading') {
			setLoading(true);
		}
	};

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

	const handlePreview = () => {
		setPreviewOpen(true);
		setPreviewTitle(file.name || file.url.substring(file.url.lastIndex('/') + 1));
	}

	const beforeUpload = (file) => {
		if (!areUploadReqsMet(file)) {
			resetUpload();
			return false;
		}
		getBase64(file, (url) => {
			setLoading(false)
			setImageURL(url);
		});
		setFile(file);
		return false;
	}

	const uploadButton = (
		<div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
			<div>
				{loading ? <LoadingOutlined /> : <PlusOutlined />}
				<div style={{ marginTop: 8 }}>Upload</div>
			</div>
		</div>
	);

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
						<Form.Item
							label='Upload cover image'
							style={{ width: 'max-content' }}
						>
							<Upload
								name='categoryImage'
								listType="picture-card"
								showUploadList={false}
								beforeUpload={beforeUpload}
								onRemove={() => {
									resetUpload();
								}}
								onChange={handleUploadChange}
							>
								{imageURL ? <img src={imageURL} alt='categoryImage'
									style={{
										height: 'auto',
										maxHeight: '100px',
										width: 'fit-content',
										maxWidth: '100%'
									}} /> : uploadButton}
							</Upload>
							{
								file &&
								<div style={{ display: 'flex', gap: '1px 10px', margin: '2px 7px' }}>
									< Button style={{}} onClick={() => handlePreview()}>
										<EyeOutlined style={{ color: 'gray' }} />
									</Button>
									< Button style={{}} onClick={() => resetUpload()}>
										<DeleteFilled style={{ color: 'red' }} />
									</Button>
								</div>
							}
							<Modal
								open={previewOpen}
								title={previewTitle}
								footer={null}
								onCancel={() => setPreviewOpen(false)}
							>
								<img alt='cover' style={{ width: '100%' }} src={imageURL} />
							</Modal>
						</Form.Item>
						<Form.Item>
							<Button
								type='primary'
								htmlType='submit'
								loading={isLoading}
								disabled={loading}
							>
								{`${isEditing ? 'Update' : 'Add'} category`}
							</Button>
						</Form.Item>
					</Form>
				</Col>
			</Row>
		</div >
	);
}
import { useState, useEffect } from 'react';
import ReactQuill from 'react-quill';
import { useDispatch, useSelector } from 'react-redux';
import { Form, Input, Button, Typography, Layout } from 'antd';

import { notifyError, notifySuccess } from '../lib/openNotification';
import AuthorComments from '../components/AuthorComments';
import ImageUploadFormItem from '../components/ImageUploadFormItem';

import {
	getAuthorInfo,
	updateAuthor,
	updateAuthorImage,
} from '../services/userAPI';
import {
	selectAuthorInfo,
	selectLoggedAuthor,
	updateAuthorInfo
} from '../redux/sliceReducers/loggedAuthorSlice';
import useImageUpload from '../hooks/useImageUpload';
import { imageDocAdded } from '../redux/sliceReducers/imageDocsSlice';
import { fetchImageFileDocRequest } from '../services/imageDocAPI';

const { Title, Text } = Typography;

export default function ProfilePage() {
	const loggedAuthor = useSelector(selectLoggedAuthor);
	const savedAuthorInfo = useSelector(selectAuthorInfo);
	const dispatch = useDispatch();
	const [uploadedImage, uploadedImageSetters] = useImageUpload();
	const [form] = Form.useForm();

	const [author, setAuthor] = useState(savedAuthorInfo || null);
	const [isDataSubmitting, setIsDataSubmitting] = useState(false);

	const handleAuthorUpdate = async (values) => {
		setIsDataSubmitting(true);
		try {
			await updateAuthorImage({
				file: uploadedImage.file,
				existingImageId: uploadedImage.existingImageId
			}, loggedAuthor.token);

			const updatedAuthor = await updateAuthor(values, loggedAuthor.token);
			dispatch(updateAuthorInfo({ info: updatedAuthor }));
			if (!uploadedImage.existingImageId && uploadedImage.file) {
				const result = await fetchImageFileDocRequest(updatedAuthor.imageFile);
				dispatch(imageDocAdded(result));
			}
			notifySuccess('Successfully updated author data');
		} catch (error) {
			notifyError(error);
		} finally {
			setIsDataSubmitting(false);
		}
	}

	const handleQuillChange = (content) => form.setFieldsValue({ bio: content })

	useEffect(() => {
		// If saved author info from redus is available, then there is no need to do api request
		// Therefore, initialize the fields value using the already saved data
		if (savedAuthorInfo) {
			form.setFieldsValue(savedAuthorInfo);
		} else {
			getAuthorInfo().then((result) => {
				setAuthor(result);
				dispatch(updateAuthorInfo({ info: result }))
				form.setFieldsValue(result);
			});
		}
	}, [savedAuthorInfo]);

	if (author === null) return;
	return (
		<Layout>
			<Title level={3}>Your profile</Title>
			<Form
				form={form}
				onFinish={handleAuthorUpdate}
				labelCol={{ span: 6 }}
				wrapperCol={{ span: 18 }}
			>
				<Form.Item label='Name' name='name'>
					<Input />
				</Form.Item>
				<Form.Item label='Email' name='email'>
					<Input />
				</Form.Item>
				<Form.Item label='Bio' name='bio'>
					<ReactQuill
						theme='snow'
						onChange={handleQuillChange}
					/>
				</Form.Item>
				<ImageUploadFormItem
					formItemLabel='Upload author picture'
					uploadedImageSetters={uploadedImageSetters}
					uploadedImage={uploadedImage}
					uploadElName='authorImage'
					showCreditFieldset={false}
					document={author}
				/>
				<Form.Item wrapperCol={{ span: 24 }} style={{ textAlign: 'right' }}>
					<Button
						type='primary'
						htmlType='submit'
						loading={isDataSubmitting}
					>
						Update
					</Button>
				</Form.Item>
			</Form>
			<Title level={3}>Comments</Title>
			{
				author.comments.length <= 0
					? <Text>You have no comments yet.</Text>
					: <AuthorComments commentsArray={author.comments} />
			}
		</Layout >
	);
}
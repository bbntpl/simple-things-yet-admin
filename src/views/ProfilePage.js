import { useState, useEffect } from 'react';
import ReactQuill from 'react-quill';
import { useDispatch, useSelector } from 'react-redux';
import { Form, Input, Button, Typography, Layout } from 'antd';

import openNotification, { notifyError } from '../lib/openNotification';
import AuthorComments from '../components/AuthorComments';
import ImageUpload from '../components/ImageUpload';

import {
	getUser,
	updateAuthor,
	updateAuthorImage,
} from '../services/userAPI';
import { getImageUrl } from '../services/helper';
import {
	selectAuthorInfo,
	selectLoggedAuthor,
	updateAuthorInfo
} from '../redux/sliceReducers/loggedAuthorSlice';
import useImageUpload from '../hooks/useImageUpload';

const { Title, Text } = Typography;

function ProfilePage() {
	const loggedAuthor = useSelector(selectLoggedAuthor);
	const savedAuthorInfo = useSelector(selectAuthorInfo);
	const dispatch = useDispatch();

	const [uploadedImage, uploadedImageSetters] = useImageUpload();

	const [form] = Form.useForm();
	const [author, setAuthor] = useState(savedAuthorInfo || null);
	const [isDataSubmitting, setIsDataSubmitting] = useState(false);

	useEffect(() => {
		// If saved author info from redus is available, then there is no need to do api request
		// Therefore, initialize the fields value using the already saved data
		if (savedAuthorInfo) {
			form.setFieldsValue(savedAuthorInfo);
		} else {
			getUser().then((result) => {
				setAuthor(result);
				dispatch(updateAuthorInfo({ info: result }))
				form.setFieldsValue(result);
			});
		}
	}, [form]);

	useEffect(() => {
		const fetchImage = async () => {
			if (author && author.imageFile && !uploadedImage.file) {
				try {
					const imageUrl = getImageUrl(author.imageFile.id);
					await uploadedImageSetters.downloadImageAndUpdateSources(imageUrl)
				} catch (err) {
					notifyError({ message: err.message });
				}
			}
		};

		fetchImage();
	}, [author]);

	const handleAuthorUpdate = async (values) => {
		setIsDataSubmitting(true);
		try {
			await updateAuthorImage(uploadedImage.file, loggedAuthor.token);
			const updatedAuthor = await updateAuthor(values, loggedAuthor.token);
			dispatch(updateAuthorInfo({ info: updatedAuthor }));
			openNotification({
				type: 'success',
				message: 'Operation successful',
				description: 'Successfully updated author data and image'
			});
		} catch (error) {
			notifyError(error);
		} finally {
			setIsDataSubmitting(false);
		}
	}

	const handleQuillChange = (content) => form.setFieldsValue({ bio: content });

	if (author === null) return;
	return (
		<Layout>
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
				<Form.Item label='Upload your picture'>
					<ImageUpload
						uploadedImage={uploadedImage}
						updateUploadedImage={uploadedImageSetters.update}
						uploadElName='authorImage'
					/>
				</Form.Item>
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

export default ProfilePage;
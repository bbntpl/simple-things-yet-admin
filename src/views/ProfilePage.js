import { useState, useEffect } from 'react';
import ReactQuill from 'react-quill';
import { useSelector } from 'react-redux';
import { Row, Col, Form, Input, Button, Typography } from 'antd';

import { getUserAccount, updateAuthor } from '../services/userAPI';
import { selectLoggedAuthor } from '../redux/sliceReducers/loggedAuthorSlice';
import openNotification from '../lib/openNotification';
import AuthorComments from '../components/AuthorComments';

const { Title, Text } = Typography;

function ProfilePage() {
	const loggedAuthor = useSelector(selectLoggedAuthor);
	const [author, setAuthor] = useState(null);
	const [form] = Form.useForm();

	useEffect(() => {
		getUserAccount().then((result) => {
			setAuthor(result);
			form.setFieldsValue(result);
		});
	}, [form]);

	const handleAuthorUpdate = (values) => {
		updateAuthor(values, loggedAuthor.token)
			.then(() => {
				openNotification({
					type: 'success',
					message: 'Operation successful',
					description: 'Successfully updated author data'
				});
			})
			.catch(error => {
				openNotification({
					type: 'error',
					message: 'Operation failed',
					description: error.message
				});
			});
	}

	const handleQuillChange = (content) => {
		form.setFieldsValue({ bio: content });
	}

	if (author === null) {
		return;
	}

	return (
		<Row gutter={[16, 16]}>
			<Col xs={24} md={12}>
				<Form form={form} onFinish={handleAuthorUpdate}>
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
					<Form.Item>
						<Button type='primary' htmlType='submit'>
							Update
						</Button>
					</Form.Item>
				</Form>
			</Col>
			<Col xs={24} md={12}>
				<Title level={3}>Comments</Title>
				{author.comments.length <= 0
					? <Text>You have no comments yet.</Text>
					: <AuthorComments commentsArray={author.comments} />}
			</Col>
		</Row>
	);
}

export default ProfilePage;
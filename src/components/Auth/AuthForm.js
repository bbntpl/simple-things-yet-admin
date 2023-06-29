import { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { Row, Col, Layout, Form, Input, Button, Typography, Space } from 'antd';

import { loginUser, registerUser } from '../../services/userAPI';
import { loginAuthor, selectLoggedAuthor } from '../../redux/sliceReducers/loggedAuthorSlice';
import LS from '../../utils/localStorage';
import openNotification from '../../lib/openNotification';
import FormErrors from '../FormErrors';

const { Title } = Typography;
const { Content } = Layout;

const contentStyle = {
	display: 'flex',
	flexDirection: 'column',
	alignItems: 'center',
	textAlign: 'center',
	minHeight: '100vh',
	height: 'max-content',
	margin: '1rem 8px'
}

const formStyle = {
	margin: '0 0 1rem 0',
}

function AuthForm({ authFormType }) {
	const loggedAuthor = useSelector(selectLoggedAuthor);
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const formRef = useRef(null);

	const [email, setEmail] = useState('');
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [errorMessages, setErrorMessages] = useState([]);
	const [isLoading, setIsLoading] = useState(false);

	const redirectAfterSuccess = (authFormType) => {
		// if there are no errors, it means the registration/login was successful
		// hence, navigate to /login or / route programmatically

		const navigateTo = authFormType === 'register' ? '/login' : '/dashboard';
		navigate(navigateTo);
		notifyAfterSuccess(authFormType);
	}

	const notifyAfterSuccess = (authFormType) => {
		openNotification({
			type: 'success',
			message: 'Operation success',
			description: `${authFormType === 'register'
				? 'Registered'
				: 'Logged in'} successfully`
		});
	}

	const handleAuthorLogin = (authorObj) => {
		const requiredProps = ['token', 'username', 'name'];
		const isAuthorObjComplete = requiredProps.every(prop => Object.hasOwn(authorObj, prop));
		if (isAuthorObjComplete) {
			// save the author (user) locally
			LS.setItem('loggedAuthor', authorObj);
			dispatch(loginAuthor(authorObj));
		}
	}

	const submitAuthorRegistration = async () => {
		const authorToBeCreated = {
			email, username, password
		}
		return await registerUser(authorToBeCreated);
	}

	const submitAuthorLogin = async () => {
		const authorToLogin = { username, password };
		return await loginUser(authorToLogin);
	}

	const submitAuthorForm = () => {
		setIsLoading(true);
		setTimeout(async () => {
			try {
				let response;
				if (authFormType === 'register') {
					response = await submitAuthorRegistration();
				} else if (authFormType === 'login') {
					response = await submitAuthorLogin();
					handleAuthorLogin(response);
				} else {
					throw new Error('There is something wrong with authFormType...');
				}

				const { errors } = response;
				if (errors) {
					setIsLoading(false);
					setErrorMessages(errors);
				} else {
					setIsLoading(false);
					setErrorMessages([]);
					redirectAfterSuccess(authFormType);
				}
			} catch (error) {
				setIsLoading(false);
				setErrorMessages([{ msg: error.message }]);
			}
		}, 500)
	}

	const resetFields = (e) => {
		e.preventDefault();
		formRef.current.resetFields();
		setEmail('');
		setUsername('');
		setPassword('');
		setErrorMessages([]);
	}
	return (
		<Content style={contentStyle}>
			{loggedAuthor && <Navigate to='/dashboard' replace={true} />}
			<Row justify='center' gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
				<Col span={32}>
					<Title level={2}>
						{authFormType === 'register'
							? 'Author Registration'
							: 'Login as author'}
					</Title>

					<Form ref={formRef} onFinish={submitAuthorForm} style={formStyle}>
						{authFormType === 'register' &&
							<Form.Item
								label='Email'
								name='email'
								style={{ maxWidth: 800 }}
							>
								<Input
									value={email}
									onChange={e => setEmail(e.target.value)}
									style={{
										minWidth: 200,
										width: '100%'
									}}
								/>
							</Form.Item>
						}

						<Form.Item
							label='Username'
							name='username'
							style={{ maxWidth: 800 }}
						>
							<Input
								value={username}
								onChange={e => setUsername(e.target.value)}
							/>
						</Form.Item>

						<Form.Item
							label='Password'
							name='password'
							style={{ maxWidth: 800 }}
						>
							<Input.Password value={password} onChange={e => setPassword(e.target.value)} />
						</Form.Item>
						<FormErrors errorMessages={errorMessages} />
						<Form.Item style={{ margin: '1rem' }}>
							<Space size='middle'>
								<Button type='primary' htmlType='submit' loading={isLoading}>
									{authFormType === 'register' ? 'Register' : 'Login'}
								</Button>

								{authFormType === 'register' &&
									<Button onClick={resetFields}>Clear</Button>
								}
							</Space>
						</Form.Item>
					</Form>
					{
						authFormType === 'register' ?
							<div>
								<p>Already have an account?</p>
								<Link to='/login'>Login now</Link>
							</div>
							: <div>
								<p>Don't have an account?</p>
								<Link to='/register'>Create a new account</Link>
							</div>
					}
				</ Col>
			</ Row>
		</Content >
	)
}

AuthForm.propTypes = {
	authFormType: PropTypes.string.isRequired
};

export default AuthForm;
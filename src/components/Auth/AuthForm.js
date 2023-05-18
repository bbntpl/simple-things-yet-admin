import { useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, Navigate } from 'react-router-dom';

import { loginUser, registerUser } from '../../services/user';
import AuthErrors from './AuthErrors';
import { loginAuthor, selectLoggedAuthor } from '../../redux/sliceReducers/loggedAuthorSlice';
import LS from '../../utils/localStorage';
import openNotification from '../../lib/openNotification';

function AuthForm({ authFormType }) {
	const loggedAuthor = useSelector(selectLoggedAuthor);
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const [email, setEmail] = useState('');
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [errorMessages, setErrorMessages] = useState([]);

	const redirectAfterSuccess = (authFormType) => {
		// if there are no errors, it means the registration/login was successful
		// hence, navigate to /login or / route programmatically

		const navigateTo = authFormType === 'register' ? '/login' : '/dashboard';
		setTimeout(() => {
			navigate(navigateTo);
			notifyAfterSuccess(authFormType);
		}, 1100);
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

	const submitAuthorForm = async (e) => {
		e.preventDefault();
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
				setErrorMessages(errors);
			} else {
				setErrorMessages([]);
				redirectAfterSuccess(authFormType);
			}
		} catch (error) {
			console.error(error);
			setErrorMessages([{ msg: 'An error occurred while submitting the form.' }]);
		}
	}

	const resetFields = (e) => {
		e.preventDefault();
		setEmail('');
		setUsername('');
		setPassword('');
		setErrorMessages([]);
	}

	return <div>
		{
			loggedAuthor && (
				<Navigate to='/dashboard' replace={true} />
			)
		}
		<h1>{authFormType === 'register' ? 'Author Registration' : 'Login as author'}</h1>
		<form onSubmit={submitAuthorForm}>
			{
				authFormType === 'register' &&
				<div>
					<label htmlFor='email'>Email: </label>
					<input value={email} onChange={e => setEmail(e.target.value)} />
				</div>
			}
			<div>
				<label htmlFor='username'>Username: </label>
				<input type='text' value={username} onChange={e => setUsername(e.target.value)} />
			</div>
			<div>
				<label htmlFor='password'>Password: </label>
				<input type='password' value={password} onChange={e => setPassword(e.target.value)} />
			</div>
			{errorMessages.length !== 0 && <AuthErrors errorMessages={errorMessages} />}
			<div>
				<input type='submit' value={authFormType === 'register' ? 'Register' : 'Login'} />
				{authFormType === 'register' && <button onClick={resetFields}>Clear</button>}
			</div>
		</form>
		{authFormType === 'register' ?
			<div>
				<p>Already have an account?</p>
				<Link to='/login'>Login now</Link>
			</div>
			: <div>
				<p>Don't have an account?</p>
				<Link to='/register'>Create a new account</Link>
			</div>
		}
	</div>
}

AuthForm.propTypes = {
	authFormType: PropTypes.string.isRequired
};

export default AuthForm;
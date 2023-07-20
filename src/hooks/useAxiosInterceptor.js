import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import { logoutAuthor } from '../redux/sliceReducers/loggedAuthorSlice';
import axiosInstance,
{ isTokenExpiredError } from '../services/axiosInstance';

function useAxiosInterceptor() {
	const navigate = useNavigate();
	const dispatch = useDispatch();

	useEffect(() => {
		const logoutWhenTokenExpires = () => {
			dispatch(logoutAuthor());
			navigate('/login', { replace: true });
		};

		// add a response interceptor
		const interceptor = axiosInstance.interceptors.response.use(function (response) {
			return response;
		}, function (error) {
			const errorMessage = error?.response?.data?.message || error.message;
			// these type of errors are for form validation
			const areFormErrorsExists = !!error?.response?.data?.errors;
			const isSingleErrorExists = !!error?.response?.data?.error;
			if (isTokenExpiredError(error)) {
				// automatically logout when the token expires
				logoutWhenTokenExpires();
				throw new Error('Token expired')
			} else if (areFormErrorsExists || isSingleErrorExists) {
				return error.response;
			} else {
				// throw errors that aren't expected to be part of form validation
				// it can be used as an error notification
				throw new Error(errorMessage);
			}
		});
		return () => {
			axiosInstance.interceptors.response.eject(interceptor);
		};
	}, [dispatch, navigate]);
}

export default useAxiosInterceptor;

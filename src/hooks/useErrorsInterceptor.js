import { useEffect, useState } from 'react';
import axiosInstance,
{ isTokenExpiredError } from '../services/axiosInstance';

function useErrorsInterceptor() {
	const [isTokenExpired, setIsTokenExpired] = useState(false);

	useEffect(() => {
		axiosInstance.interceptors.response.use(
			function (response) {
				return response;
			},
			function (error) {
				const errorMessage = error?.response?.data?.message || error.message;

				// these type of errors are for form validation
				const areFormErrorsExists = !!error?.response?.data?.errors;
				const isSingleErrorExists = !!error?.response?.data?.error;

				if (isTokenExpired) {
					setIsTokenExpired(false);
				}

				if (isTokenExpiredError(error)) {
					// automatically logout when the token expires
					setIsTokenExpired(true);
					throw new Error('User session has ended');
				} else if (areFormErrorsExists || isSingleErrorExists) {
					return error.response;
				} else {
					// throw errors that aren't expected to be part of form validation
					// it can be used as an error notification
					throw new Error(errorMessage);
				}
			}
		);
	});

	return isTokenExpired;
}

export default useErrorsInterceptor;


import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { jwtDecode } from 'jwt-decode';
import { Alert } from 'antd';

import { selectToken } from '../../redux/sliceReducers/loggedAuthorSlice';
import LoginModal from './LoginModal';

function AuthStatusManager() {
	const authToken = useSelector(selectToken);
	const [isTokenExpired, setIsTokenExpired] = useState(false);
	const [isTokenToExpireInOneMinute, setIsTokenToExpireInOneMinute] = useState(false);

	const refreshTokenStatuses = () => {
		setIsTokenToExpireInOneMinute(false);
		setIsTokenExpired(false);
	};

	const handleTokenCheck = (decodedToken) => {
		const warningTime = decodedToken.exp - 60;
		const currentTimestamp = Math.floor(Date.now() / 1000);

		if (currentTimestamp >= warningTime && currentTimestamp < decodedToken.exp) {
			setIsTokenToExpireInOneMinute(true);
		} else if (currentTimestamp >= decodedToken.exp) {
			setIsTokenExpired(true);
		} else {
			refreshTokenStatuses();
		}
	};

	useEffect(() => {
		if (!authToken) return;

		const decodedToken = jwtDecode(authToken);

		handleTokenCheck(decodedToken);

		const events = ['load', 'mousemove', 'mousedown', 'click', 'scroll', 'keypress'];

		const handleEvent = () => {
			handleTokenCheck(decodedToken);
		};

		events.forEach(event => {
			window.addEventListener(event, handleEvent);
		});

		return () => {
			events.forEach(event => {
				window.removeEventListener(event, handleEvent);
			});
		};
	}, [authToken]);

	return <>
		{isTokenExpired
			&& <LoginModal refreshTokenStatuses={refreshTokenStatuses} />}
		{isTokenToExpireInOneMinute
			&& <Alert
				style={{
					position: 'absolute',
					top: '7%',
				}}
				message='Your session is about to end'
				description='You will automatically logout soon. Please prepare to re-login by saving your changes.'
				type='warning'
				showIcon={true}
				closable
			/>}
	</>;
}

export default AuthStatusManager;

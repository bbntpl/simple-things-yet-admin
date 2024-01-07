import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Layout } from 'antd';

import { selectLoggedAuthor } from '../redux/sliceReducers/loggedAuthorSlice';
import useErrorsInterceptor from '../hooks/useErrorsInterceptor';
import NavHeader from '../components/NavHeader';
import GoBackButton from '../components/GoBackButton';
import AuthStatusManager from '../components/Auth/AuthStatusManager';

function AuthGateway({ children }) {
	const loggedAuthor = useSelector(selectLoggedAuthor);

	// Handle detected errors through middleware and display them
	// based on the defined conditions
	useErrorsInterceptor();

	if (loggedAuthor === null) {
		return <Navigate to='/login' replace={true} />;
	}

	return (
		<>
			<NavHeader />
			<GoBackButton />
			<Layout className='responsive-layout'>
				{children}
			</Layout>
			<AuthStatusManager />
		</>
	);
}

export default AuthGateway;
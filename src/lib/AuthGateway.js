import { Navigate, useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Layout } from 'antd';

import { selectLoggedAuthor } from '../redux/sliceReducers/loggedAuthorSlice';
import useAutomaticLogoutOnTokenExpiry from '../hooks/useAxiosInterceptor';
import NavHeader from '../components/NavHeader';

const { Content } = Layout;

const contentStyle = {
	textAlign: 'center',
	minHeight: '100vh',
	height: 'max-content',
	margin: '1rem 1.5rem'
}

function AuthGateway({ children }) {
	const location = useLocation();
	const navigate = useNavigate();
	const loggedAuthor = useSelector(selectLoggedAuthor);

	// must logout automatically if received token expiry error
	// from backend API
	useAutomaticLogoutOnTokenExpiry();

	const isCurrentlyIndexPage = () => {
		return location.pathname === '/' || location.pathname === '/dashboard';
	}

	if (loggedAuthor === null) {
		return <Navigate to='/login' replace={true} />;
	}

	return (
		<>
			<NavHeader />
			{
				isCurrentlyIndexPage() ? null
					: <button
						// navigate to previous page if clicked
						onClick={() => navigate(-1)}
						style={{
							cursor: 'pointer',
							textDecoration: 'underline',
							width: 'max-content',
							backgroundColor: 'transparent',
							border: 0,
							margin: '1rem 1.5rem'
						}}
					>
						Go back
					</button>
			}
			<Content style={contentStyle}>
				{children}
			</Content>
		</>
	);
}

export default AuthGateway;
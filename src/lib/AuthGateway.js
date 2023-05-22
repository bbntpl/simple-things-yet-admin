import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectLoggedAuthor } from '../redux/sliceReducers/loggedAuthorSlice';
import useAutomaticLogoutOnTokenExpiry from '../hooks/useAxiosInterceptor';
import NavHeader from '../components/NavHeader';

function AuthGateway({ children }) {
	const loggedAuthor = useSelector(selectLoggedAuthor);
	useAutomaticLogoutOnTokenExpiry();

	if (loggedAuthor === null) {
		return <Navigate to='/login' replace={true} />;
	}

	return (
		<>
			<NavHeader />
			{children}
		</>
	);
}

export default AuthGateway;
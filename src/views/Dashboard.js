import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

import { selectLoggedAuthor } from '../redux/sliceReducers/loggedAuthorSlice';
import NavigationBar from '../components/NavigationBar';

export default function Dashboard() {
	const loggedAuthor = useSelector(selectLoggedAuthor)

	const [author, setAuthor] = useState(loggedAuthor);

	return <div>
		{
			author === null && (
				<Navigate to='/login' replace={true} />
			)
		}
		<NavigationBar />
		This is Homepage
	</div>
}
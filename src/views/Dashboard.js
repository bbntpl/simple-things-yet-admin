import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

import { selectLoggedAuthor } from '../redux/sliceReducers/loggedAuthorSlice';
import NavButton from '../components/NavButton';

export default function Dashboard() {
	const loggedAuthor = useSelector(selectLoggedAuthor)

	const [author, setAuthor] = useState(loggedAuthor);

	return <div>
		{
			author === null && (
				<Navigate to='/login' replace={true} />
			)
		}
		<div>
			<NavButton text='Create a blog' navigateTo='/create-blog' />
			<NavButton text='Create a category' navigateTo='/create-category' />
		</div>
		This is Homepage
	</div>
}
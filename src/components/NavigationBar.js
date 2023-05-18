import {
	Link,
	useNavigate,
} from 'react-router-dom';
import {
	useDispatch,
	useSelector
} from 'react-redux';

import { logoutAuthor, selectLoggedAuthor } from '../redux/sliceReducers/loggedAuthorSlice';

function NavigationBar() {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const loggedAuthor = useSelector(selectLoggedAuthor);

	const handleGoBack = () => {
		navigate(-1)
	};

	const handleAuthorLogout = () => {
		dispatch(logoutAuthor());
		setTimeout(() => {
			navigate('/login');
		}, 1500);
	}

	return <div>
		<div>
			<button onClick={handleGoBack}>Go back</button>
		</div>
		<div>
			<Link to='/profile'>{loggedAuthor.name}</Link>
			<button onClick={handleAuthorLogout}>
				logout
			</button>
		</div>
	</div>
}

export default NavigationBar;
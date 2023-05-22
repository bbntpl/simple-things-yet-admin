import {
	Link,
	useNavigate,
} from 'react-router-dom';
import {
	useDispatch,
	useSelector
} from 'react-redux';
import { Layout } from 'antd';

import { logoutAuthor, selectLoggedAuthor } from '../redux/sliceReducers/loggedAuthorSlice';

const { Header } = Layout;


function NavHeader() {
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

	return <Header
		style={{
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'space-between'
		}}
	>
		<div>
			<button onClick={handleGoBack}>Go back</button>
		</div>
		<div>
			<Link to='/profile'>{loggedAuthor.name}</Link>
			<button onClick={handleAuthorLogout}>
				logout
			</button>
		</div>
	</Header>
}

export default NavHeader;
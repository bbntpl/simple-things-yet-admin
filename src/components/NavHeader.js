import {
	Link,
	useNavigate,
} from 'react-router-dom';
import {
	useDispatch,
	useSelector
} from 'react-redux';
import { Layout, Space } from 'antd';

import { logoutAuthor, selectLoggedAuthor } from '../redux/sliceReducers/loggedAuthorSlice';

const { Header } = Layout;


function NavHeader() {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const loggedAuthor = useSelector(selectLoggedAuthor);

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
			justifyContent: 'flex-end',
			color: '#00000f'
		}}
	>
		<Space>
			<Link to='/profile'
				style={{ color: 'aliceblue' }}
			>
				<strong>
					{loggedAuthor.name}
				</strong>
			</Link>
			<button
				style={{
					color: 'aliceblue',
					textDecoration: 'underline',
					border: 0,
					backgroundColor: 'transparent'
				}}
				onClick={handleAuthorLogout}
			>
				logout
			</button>
		</Space>
	</Header>
}

export default NavHeader;
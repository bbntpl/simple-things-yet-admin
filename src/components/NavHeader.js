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
import { HomeFilled } from '@ant-design/icons';

const { Header } = Layout;

function NavHeader() {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const loggedAuthor = useSelector(selectLoggedAuthor);

	const handleAuthorLogout = () => {
		dispatch(logoutAuthor());
		navigate('/login');
	}

	return <Header
		style={{
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'space-between',
			color: '#00000f'
		}}
	>
		<button
			onClick={() => navigate('/')}
			style={{
				backgroundColor: 'transparent',
				border: 0
			}}
		>
			<HomeFilled style={{
				color: 'aliceblue',
				cursor: 'pointer',
			}} />
		</button>
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
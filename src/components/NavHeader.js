import {
	Link,
	useNavigate,
} from 'react-router-dom';
import {
	useDispatch,
	useSelector
} from 'react-redux';
import { Avatar, Layout, Space } from 'antd';

import { logoutAuthor, selectAuthorInfo, selectLoggedAuthor } from '../redux/sliceReducers/loggedAuthorSlice';
import { HomeFilled } from '@ant-design/icons';
import { getImageUrl } from '../services/helper';

const { Header } = Layout;

function NavHeader() {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const loggedAuthor = useSelector(selectLoggedAuthor);
	const savedAuthorInfo = useSelector(selectAuthorInfo);

	const avatarSrc = getImageUrl(savedAuthorInfo?.imageFile);

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
				<Space>
					<Avatar src={avatarSrc} shape='circle' size={32} />
					<strong>
						{loggedAuthor.name}
					</strong>
				</Space>
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
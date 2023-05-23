import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

import { selectLoggedAuthor } from '../redux/sliceReducers/loggedAuthorSlice';
import NavButton from '../components/NavButton';
import { Divider, Space } from 'antd';

export default function Dashboard() {
	const loggedAuthor = useSelector(selectLoggedAuthor)

	return <div>
		{
			loggedAuthor === null && (
				<Navigate to='/login' replace={true} />
			)
		}
		<Space size={[8, 16]} wrap>
			<NavButton text='Create a blog' navigateTo='/create-blog' />
			<NavButton text='Create a category' navigateTo='/create-category' />
		</Space>
		<Divider>
			Resources
		</Divider>
		<Space size={[8, 16]} wrap>
			<NavButton text='Collection of blogs' navigateTo='/blogs' />
			<NavButton text='Collection of comments' navigateTo='/comments' />
			<NavButton text='Navigate to viewers page' navigateTo='/viewers' />
		</Space>
	</div>
}
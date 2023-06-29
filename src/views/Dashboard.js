import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

import { selectLoggedAuthor } from '../redux/sliceReducers/loggedAuthorSlice';
import NavButton from '../components/NavButton';
import { Divider, Layout, Space } from 'antd';

export default function Dashboard() {
	const loggedAuthor = useSelector(selectLoggedAuthor)

	return <>
		{
			loggedAuthor === null && (
				<Navigate to='/login' replace={true} />
			)
		}
		<Layout>
			<Space size={[8, 16]} wrap style={{
				display: 'flex',
				margin: '1rem 0 1rem 0',
				justifyContent: 'center'
			}}>
				<NavButton text='Create a blog' navigateTo='/create-blog' />
				<NavButton text='Create a category' navigateTo='/create-category' />
			</Space>
			<Divider>
				Resources
			</Divider>
			<Space size={[8, 16]} wrap style={{
				display: 'flex',
				margin: '1rem 0 1rem 0',
				justifyContent: 'center'
			}}>
				<NavButton text='Saved drafts (unpublished blogs)' navigateTo='/drafts' />
				<NavButton text='Published blogs' navigateTo='/blogs' />
				<NavButton text='Collection of comments' navigateTo='/comments' />
				<NavButton text='Navigate to viewers page' navigateTo='/viewers' />
			</Space>
		</Layout>
	</>
}
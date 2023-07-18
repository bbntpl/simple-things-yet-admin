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
				marginBottom: '1rem',
				marginTop: '1rem',
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
				marginBottom: '1rem',
				marginTop: '1rem',
				justifyContent: 'center'
			}}>
				<NavButton text='Saved drafts' navigateTo='/drafts' />
				<NavButton text='Blog categories' navigateTo='/categories' />
				<NavButton text='Published blogs' navigateTo='/blogs' />
				<NavButton text='Collection of comments' navigateTo='/comments' />
				<NavButton text='Navigate to viewers page' navigateTo='/viewers' />
			</Space>
		</Layout>
	</>
}
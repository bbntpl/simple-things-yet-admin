import 'react-quill/dist/quill.snow.css';
import './app.css';
import { Provider } from 'react-redux';
import {
	BrowserRouter as Router,
	Routes,
	Route
} from 'react-router-dom';

import LoginPage from './views/auth/LoginPage';
import RegisterPage from './views/auth/RegisterPage';
import CreateCategoryPage from './views/categories/CreateCategoryPage';
import CategoryCollection from './views/categories/CategoryCollection';
import ProfilePage from './views/ProfilePage';
import CreateBlogPage from './views/blogs/CreateBlogPage';
import BlogsPage from './views/blogs/BlogsPage';
import BlogPage from './views/blogs/BlogPage';
import BlogsPageByTag from './views/blogs/BlogsPageByTag';
import BlogsPageByCategory from './views/blogs/BlogsPageByCategory';
import UpdateBlogPage from './views/blogs/UpdateBlogPage';
import ViewersPage from './views/viewers/ViewersPage';
import ViewerPage from './views/viewers/ViewerPage';
import CommentsPage from './views/comments/CommentsPage';
import CommentPage from './views/comments/CommentPage';
import Dashboard from './views/Dashboard';
import AuthGateway from './lib/AuthGateway';

import store from './redux/store';
import NotFoundPage from './views/NotFoundPage';
import { Layout } from 'antd';
import DraftsPage from './views/blogs/DraftsPage';

function App() {
	return (
		<Provider store={store}>
			<Router>
				<Layout>
					<Routes>
						<Route path='/' element={
							<AuthGateway>
								<Dashboard />
							</AuthGateway>
						} />
						<Route path='/dashboard' element={
							<AuthGateway>
								<Dashboard />
							</AuthGateway>
						} />
						<Route path='/login' element={<LoginPage />} />
						<Route path='/register' element={<RegisterPage />} />
						<Route path='/create-category' element={
							<AuthGateway>
								<CreateCategoryPage />
							</AuthGateway>
						} >
						</Route>
						<Route path='/create-blog' element={
							<AuthGateway>
								<CreateBlogPage />
							</AuthGateway>
						} >
						</Route>
						<Route path='/profile' element={
							<AuthGateway>
								<ProfilePage />
							</AuthGateway>
						} >
						</Route>
						<Route exact path='/drafts' element={
							<AuthGateway>
								<DraftsPage />
							</AuthGateway>
						} >
						</Route>
						<Route exact path='/categories' element={
							<AuthGateway>
								<CategoryCollection />
							</AuthGateway>
						} >
						</Route>
						<Route exact path='/blogs' element={
							<AuthGateway>
								<BlogsPage />
							</AuthGateway>
						} >
						</Route>
						<Route path='/blog/:id/update' element={
							<AuthGateway>
								<UpdateBlogPage />
							</AuthGateway>
						} >
						</Route>
						<Route path='/blog/:id' element={
							<AuthGateway>
								<BlogPage />
							</AuthGateway>
						} >
						</Route>
						<Route path='/draft/:id' element={
							<AuthGateway>
								<BlogPage />
							</AuthGateway>
						} >
						</Route>
						<Route path='/tag/:tagSlug' element={
							<AuthGateway>
								<BlogsPageByTag />
							</AuthGateway>
						}>
						</Route>

						<Route path='/category/:categorySlug' element={
							<AuthGateway>
								<BlogsPageByCategory />
							</AuthGateway>
						}>
						</Route>
						<Route exact path='/viewers' element={
							<AuthGateway>
								<ViewersPage />
							</AuthGateway>
						} >
						</Route>
						<Route path='/viewers/:id' element={
							<AuthGateway>
								<ViewerPage />
							</AuthGateway>
						} >
						</Route>
						<Route exact path='/comments' element={
							<AuthGateway>
								<CommentsPage />
							</AuthGateway>
						} >
						</Route>
						<Route path='/comments/:id' element={
							<AuthGateway>
								<CommentPage />
							</AuthGateway>
						} >
						</Route>
						<Route path='*' element={<NotFoundPage />} />
					</Routes>
				</Layout>
			</Router>
		</Provider >
	);
}

export default App;
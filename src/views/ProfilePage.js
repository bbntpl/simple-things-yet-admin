import { useState, useEffect } from 'react';
import ReactQuill from 'react-quill';
import { getUserAccount, updateAuthor } from '../services/userAPI';
import { useSelector } from 'react-redux';
import { selectLoggedAuthor } from '../redux/sliceReducers/loggedAuthorSlice';
import openNotification from '../lib/openNotification';
import 'react-quill/dist/quill.snow.css';

function AuthorComments({ commentsArray }) {
	return <ul>
		{commentsArray.map(comment => {
			return <li key={`author-profile_${comment.id}`}>
				{comment.content}
			</li>
		})}
	</ul>
}

function ProfilePage() {
	const loggedAuthor = useSelector(selectLoggedAuthor);
	const [author, setAuthor] = useState(null);

	useEffect(() => {
		getUserAccount().then((result) => {
			setAuthor(result);
		})
	}, [])

	const handleChange = (e) => {
		e.preventDefault();
		setAuthor(author => ({
			...author,
			[e.target.name]: e.target.value
		}))
	}

	const handleAuthorUpdate = (e) => {
		e.preventDefault();
		updateAuthor(author, loggedAuthor.token)
			.then(() => {
				openNotification({
					type: 'success',
					message: 'Operation successful',
					description: 'Successfully updated author data'
				})
			})
			.catch(error => {
				openNotification({
					type: 'error',
					message: 'Operation failed',
					description: error.message
				})
			});
	}
	const handleQuillChange = (content) => {
		setAuthor(author => ({
			...author,
			bio: content
		}))
	}

	if (author === null) {
		return;
	}

	return <div>
		<div>
			<form onSubmit={handleAuthorUpdate}>
				<div>
					<label htmlFor='name'>Name: </label>
					<input value={author.name} name='name' onChange={handleChange} />
				</div>
				<div>
					<label htmlFor='email'>Email: </label>
					<input value={author.email} name='email' onChange={handleChange} />
				</div>
				<div>
					<label htmlFor='bio'>Bio: </label>
					<ReactQuill
						theme='snow'
						value={author.bio}
						onChange={handleQuillChange}
					/>
				</div>
				<input type='submit' value='Update' />
			</form>
		</div>
		<h1>Comments</h1>
		{author.comments.length <= 0 ? <p>You have no comments yet.</p>
			: <AuthorComments />}
	</div>
}

export default ProfilePage;
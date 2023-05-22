import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import FormErrors from '../../components/FormErrors';
import { createCategoryRequest } from '../../services/categoryAPI';
import { selectToken } from '../../redux/sliceReducers/loggedAuthorSlice';
import { createCategoryReducer } from '../../redux/sliceReducers/categoriesSlice';
import openNotification from '../../lib/openNotification';

function CreateCategoryPage() {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const authorToken = useSelector(selectToken);
	const [category, setCategory] = useState({
		name: '',
		description: ''
	});
	const [errorMessages, setErrorMessages] = useState([]);

	const handleChange = (e) => {
		setCategory(category => ({
			...category,
			[e.target.name]: e.target.value
		}))
	}

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const response = await createCategoryRequest(category, authorToken);

			if (!!response?.errors) {
				setErrorMessages(response?.errors);
			} else if (!!response?.error) {
				setErrorMessages([{ msg: response?.error }]);
			} else {
				setErrorMessages([]);
				setTimeout(() => {
					dispatch(createCategoryReducer(category));
					navigate('/dashboard');
					openNotification({
						type: 'success',
						message: 'Successful operation',
						description: `New category "${category.name}" is successfully submitted`,
					})
				}, 1100);
			}
		} catch (error) {
			console.log(error);
			setErrorMessages([{ msg: 'An error occurred while submitting the form.' }]);
		}
	}

	return <div>
		<form>
			<h1>Create a blog category </h1>
			<div>
				<label htmlFor='name'>Category Name: </label>
				<input
					id='name'
					type='text'
					name='name'
					value={category.name}
					onChange={handleChange}
				/>
			</div>
			<div>
				<label htmlFor='description'>Category Description: </label>
				<textarea
					id='description'
					name='description'
					value={category.description}
					onChange={handleChange}
				>
				</textarea>
			</div>
			<FormErrors errorMessages={errorMessages} />
			<input
				type='submit'
				value='Add category'
				onClick={handleSubmit}
			/>
		</form>
	</div>
}

export default CreateCategoryPage;
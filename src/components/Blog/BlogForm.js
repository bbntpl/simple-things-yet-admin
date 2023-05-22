import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Switch, Input, Checkbox, Spin } from 'antd';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

import { fetchCategories, selectCategories } from '../../redux/sliceReducers/categoriesSlice';

const toolbarOprions = [
	[{ 'header': 1 }, { 'header': 2 }],
	['bold', 'italic', 'underline', 'strike', 'blockquote', 'code-block'],
	[{ 'list': 'ordered' }, { 'list': 'bullet' }],
	[{ 'script': 'sub' }, { 'script': 'super' }],
	[{ 'indent': '-1' }, { 'indent': '+1' }],
	[{ 'direction': 'rtl' }],
	[{ 'size': ['small', false, 'large', 'huge'] }],
	[{ 'header': [1, 2, 3, 4, 5, 6, false] }],
	[{ 'color': [] }, { 'background': [] }],
	[{ 'font': [] }],
	[{ 'align': [] }],
	['link', 'image'],
	['clean'],
];

function BlogForm({ blog, setBlog, handleBlogSubmit, handleBlogDeletion, editing }) {
	const dispatch = useDispatch();
	const blogCategories = useSelector(selectCategories) || null;

	useEffect(() => {
		dispatch(fetchCategories())
	}, [dispatch]);

	const handleChange = (e) => {
		setBlog(blog => ({
			...blog,
			[e.target.name]: e.target.value
		}))
	}

	const handleQuillChange = (content) => {
		setBlog(blog => ({
			...blog,
			content
		}))
	}

	const handleSwitch = (checked) => {
		setBlog(blog => ({
			...blog,
			private: checked
		}))
	}

	const handleCategoriesChange = (checkedValues) => {
		const checkedCategories = blogCategories.filter(cat => {
			return checkedValues.includes(cat.name);
		});

		setBlog(blog => ({
			...blog,
			categories: checkedCategories
		}));
	}

	const getCategoriesOptions = (blogCategories) => {
		return blogCategories.map(cat => {
			return {
				label: cat.name,
				value: cat.name
			}
		})
	}

	return (
		<div>
			<form onSubmit={handleBlogSubmit}>
				<h1>{editing ? 'Update Blog' : 'Create a blog category'}</h1>
				<div>
					<label htmlFor='title'>Title: </label>
					<Input
						placeholder='Blog title'
						id='title'
						value={blog.title}
						name='title'
						onChange={handleChange}
					/>
				</div>
				<div>
					<label htmlFor='categories'>Categories: </label>
					{
						blogCategories ? <Checkbox.Group
							name='categories'
							options={getCategoriesOptions(blogCategories)}
							value={blog.categories.map(cat => cat.name)}
							onChange={handleCategoriesChange} />
							: <Spin />
					}

				</div>
				<div>
					<label htmlFor='private'>Private: </label>
					<Switch defaultChecked={blog.private} name='private' onChange={handleSwitch} />
				</div>
				<div>
					<label htmlFor='content'>Content: </label>
					<ReactQuill
						theme='snow'
						value={blog.content}
						onChange={handleQuillChange}
						modules={{ toolbar: toolbarOprions }}
					/>
				</div>
				<input type='submit' value={editing ? 'Update blog' : 'Post blog'} />
				{editing && <button type='button' onClick={handleBlogDeletion}>Delete</button>}
			</form>
		</div>
	);
}

export default BlogForm;

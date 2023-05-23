import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
	Row,
	Col,
	Form,
	Input,
	Checkbox,
	Switch,
	Spin,
	Button,
	Typography
} from 'antd';
import ReactQuill from 'react-quill';

import { fetchCategories, selectCategories } from '../../redux/sliceReducers/categoriesSlice';

const { Title } = Typography;

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
		}).map(cat => cat.id);

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
		<>
			<Title level={2}>Create a new blog</Title>
			<Row justify='center'>
				<Col xs={24} sm={24} md={18} lg={12}>
					<Form layout='vertical' onFinish={handleBlogSubmit}>
						<Form.Item label='Title' name='title'>
							<Input
								placeholder='Blog title'
								value={blog.title}
								onChange={(e) => handleChange(e)}
							/>
						</Form.Item>
						<Form.Item
							label='Categories'
							name='categories'
							labelCol={{ span: 4 }}
							wrapperCol={{ span: 24 }}
							style={{ display: 'grid', gridTemplateColumns: '1fr', alignItems: 'start' }}
						>
							{blogCategories ?
								<Checkbox.Group
									style={{ flexWrap: 'wrap' }}
									options={getCategoriesOptions(blogCategories)}
									value={blogCategories
										.filter(cat => blog.categories.includes(cat.id))
										.map(cat => cat.name)}
									onChange={(values) => handleCategoriesChange(values)}
								/> : <Spin />
							}
						</Form.Item>
						<Form.Item label='Private' name='private' labelCol={{ span: 5 }} wrapperCol={{ span: 1 }} style={{ dislay: 'inline' }}>
							<Switch checked={blog.private} onChange={(checked) => handleSwitch(checked)} />
						</Form.Item>
						<Form.Item label='Content' name='content'>
							<ReactQuill
								theme='snow'
								value={blog.content}
								onChange={(content) => handleQuillChange(content)}
								modules={{ toolbar: toolbarOprions }}
							/>
						</Form.Item>
						<Form.Item>
							<Button type='primary' htmlType='submit'>{editing ? 'Update blog' : 'Post blog'}</Button>
							{editing && <Button type='danger' onClick={handleBlogDeletion}>Delete</Button>}
						</Form.Item>
					</Form>
				</Col>
			</Row>
		</>
	);
}

export default BlogForm;

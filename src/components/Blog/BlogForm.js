import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import {
	Row,
	Col,
	Form,
	Input,
	Checkbox,
	Switch,
	Button,
	Popconfirm,
	Space,
	Spin,
} from 'antd';
import ReactQuill from 'react-quill';

import { fetchCategories } from '../../redux/sliceReducers/categoriesSlice';

const toolbarOprions = [
	[{ 'header': 1 }, { 'header': 2 }],
	['bold', 'italic', 'underline', 'strike', 'blockquote', 'code-block'],
	[{ 'list': 'ordered' }, { 'list': 'bullet' }],
	[{ 'script': 'sub' }, { 'script': 'super' }],
	[{ 'indent': '-1' }, { 'indent': '+1' }],
	[{ 'direction': 'rtl' }],
	[{ 'size': ['small', false, 'large', 'huge'] }],
	[{ 'header': [1, 2, 3, 4, 5, 6, false] }],
	[{ 'font': [] }],
	[{ 'align': [] }],
	['link', 'image'],
	['clean'],
];

export default function BlogForm({
	initialFormValues,
	blogCategories,
	handleSaveDraft,
	handleBlogSubmit,
	handleBlogDeletion,
	isEditing = false,
	isSubmitBtnLoading,
	form,
}) {
	const dispatch = useDispatch();
	const [isLoadingData, setIsLoadingData] = useState(true);

	// Dispatch the fetchCategories inside a useEffect
	useEffect(() => {
		dispatch(fetchCategories())
			.then(() => setIsLoadingData(false))
			.catch(err => console.error(err));
	}, [dispatch, setIsLoadingData]);

	const getCategoriesOptions = (blogCategories) => {
		return blogCategories.map(cat => ({ label: cat.name, value: cat.name }));
	}

	const extractCategoryNames = (newCategories) => {
		const categoryNames = (blogCategories && blogCategories.length > 0)
			? newCategories.map((catId) => {
				const categoryObj = blogCategories.find((blogCat) => blogCat.id === catId);
				return categoryObj.name;
			}) : []
		return categoryNames;
	}

	if(isLoadingData) {
		return <Spin />
	}

	return (
		<>
			<Row justify='center'>
				<Col xs={24} sm={24} md={18} lg={12}>
					<Form
						layout='vertical'
						form={form}
						onValuesChange={(changedValues) => {
							console.log(changedValues);
						}}

						initialValues={{
							title: initialFormValues.title,
							content: initialFormValues.content,
							categories: extractCategoryNames(initialFormValues.categories),
							isPrivate: initialFormValues.isPrivate
						}}
					>
						<Form.Item label='Title' name='title'>
							<Input placeholder='Blog title' />
						</Form.Item>
						<Form.Item
							valuePropName='defaultValue'
							label='Categories'
							name='categories'
							labelCol={{ span: 4 }}
							wrapperCol={{ span: 24 }}
							style={{ display: 'grid', gridTemplateColumns: '1fr', alignItems: 'start' }}
						>
							<Checkbox.Group
								style={{ flexWrap: 'wrap' }}
								options={getCategoriesOptions(blogCategories)}
							/>
						</Form.Item>
						<Form.Item
							valuePropName='checked'
							label='Private'
							name='isPrivate'
							labelCol={{ span: 5 }}
							wrapperCol={{ span: 1 }}
							style={{ dislay: 'inline' }}
						>
							<Switch />
						</Form.Item>
						<Form.Item label='Content' name='content'>
							<ReactQuill
								theme='snow'
								modules={{ toolbar: toolbarOprions }}
							/>
						</Form.Item>
						<Form.Item>
							<Space>
								<Button
									htmlType='button'
									onClick={handleSaveDraft()}
									loading={isSubmitBtnLoading}
								>
									{`Save blog ${isEditing ? '' : 'as draft'}`}
								</Button>
								{
									// Display publish button if blog is not yet published
									!initialFormValues?.isPublished &&
									<Popconfirm
										title='Publish the blog'
										description='Are you sure you want to publish this blog'
										onConfirm={handleBlogSubmit()}
										okText='Yes'
									>
										<Button
											type='primary'
											htmlType='submit'
											loading={isSubmitBtnLoading}
										>
											Publish blog
										</Button>
									</Popconfirm>
								}
								{
									isEditing && <Popconfirm
										title='Delete the blog'
										description='Are you sure you want to delete this blog'
										onConfirm={handleBlogDeletion}
										okText='Yes'
									>
										<Button danger>Delete</Button>
									</Popconfirm>
								}
							</Space>
						</Form.Item>
					</Form>
				</Col>
			</Row>
		</>
	);
}
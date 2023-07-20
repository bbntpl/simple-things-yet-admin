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
	Radio,
} from 'antd';
import ReactQuill from 'react-quill';
import { useNavigate, useParams } from 'react-router-dom';

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
	blogTags,
	handleSaveDraft,
	handleBlogSubmit,
	handleBlogDeletion,
	isEditing = false,
	isSubmitBtnLoading,
	form,
}) {
	const { id } = useParams();
	const navigate = useNavigate();
	const getCategoryOptions = (blogCategories) => {
		return blogCategories.map(cat => ({ label: cat.name, value: cat.name }));
	}

	const getTagOptions = (blogTags) => {
		return blogTags.map(tag => ({ label: tag.name, value: tag.name }));
	}

	const extractTagNames = (newTags) => {
		const tagNames = (blogTags && blogTags.length > 0)
			? newTags.map((tagId) => {
				const tag = blogTags.find((blogTag) => blogTag.id === tagId);
				return tag.name;
			}) : []
		return tagNames;
	}

	return (
		<>
			<Row justify='center'>
				<Col xs={24} sm={24} md={18} lg={12}>
					<Form
						layout='vertical'
						form={form}
						initialValues={{
							title: initialFormValues.title,
							content: initialFormValues.content,
							category: (blogCategories.find(cat => cat.id === initialFormValues.category) || {}).name || undefined,
							tags: extractTagNames(initialFormValues.tags),
							isPrivate: initialFormValues.isPrivate
						}}
					>
						<Form.Item label='Title' name='title'>
							<Input placeholder='Blog title' />
						</Form.Item>
						<Form.Item
							valuePropName='value'
							label='Select a blog category'
							name='category'
							labelCol={{ span: 4 }}
							wrapperCol={{ span: 24 }}
							style={{ display: 'grid', gridTemplateColumns: '1fr', alignItems: 'start' }}
						>
							<Radio.Group
								optionType='button'
								buttonStyle='solid'
								options={[
									...getCategoryOptions(blogCategories),
									{ label: 'none', value: undefined, }
								]}
							/>
						</Form.Item>
						<Form.Item
							valuePropName='defaultValue'
							label='Tags'
							name='tags'
							labelCol={{ span: 4 }}
							wrapperCol={{ span: 24 }}
							style={{ display: 'grid', gridTemplateColumns: '1fr', alignItems: 'start' }}
						>
							<Checkbox.Group
								style={{ flexWrap: 'wrap' }}
								options={getTagOptions(blogTags)}
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
								{
									initialFormValues.isPublished ?
										<Button
											htmlType='dashed'
											onClick={() => navigate(`/blog/${id}`)}
										>
											Preview
										</Button> : null
								}
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
			</Row >
		</>
	);
}
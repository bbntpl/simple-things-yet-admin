import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Divider, Layout, Popconfirm, Space, Spin } from 'antd';
import { useEffect } from 'react';
import Title from 'antd/es/typography/Title';

import { notifyError } from '../../lib/openNotification';
import BlogList from '../../components/Blog/BlogList';
import { deleteTagRequest, updateTagRequest } from '../../services/tagAPI';
import { tagDeleted, fetchTags, selectTag, tagUpdated } from '../../redux/sliceReducers/tagsSlice';
import { selectToken } from '../../redux/sliceReducers/loggedAuthorSlice';
import { initializeBlogs, selectBlogsWithTag } from '../../redux/sliceReducers/blogsSlice';

export default function BlogsPageByTag() {
	const { tagSlug } = useParams();
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const authorToken = useSelector(selectToken);
	const tag = useSelector(selectTag(tagSlug));
	const tagStatus = useSelector(state => state.tags.status);
	const blogStatus = useSelector(state => state.blogs.status);
	const blogs = useSelector(selectBlogsWithTag(tag?.id || null));

	useEffect(() => {
		if (tagStatus === 'idle') {
			dispatch(fetchTags());
		}
		if (blogStatus === 'idle') {
			dispatch(initializeBlogs());
		}
	}, [blogStatus, dispatch, tagStatus])

	const handleTagDeletion = async () => {
		if (tag.blogs.length) return;
		deleteTagRequest(tag.id, authorToken)
			.then(() => {
				dispatch(tagDeleted(tag.id));
				navigate(-1);
			})
			.catch(err => {
				notifyError(err);
			})
	}

	const handleTagUpdate = async (tagName) => {
		if (tagName !== tag.name) {
			updateTagRequest(tag.id, { ...tag, name: tagName }, authorToken)
				.then(result => {
					if (result?.error) throw new Error(result.error);
					dispatch(tagUpdated(result));
					navigate(`/tag/${result.slug}`);
				})
				.catch(err => {
					notifyError(err);
				})
		}
	}

	if (blogStatus !== 'succeeded' || blogStatus !== 'succeeded') {
		return <Spin />
	}

	if (!tag && tagStatus === 'succeeded') {
		return <div>This tag does not exist.</div>
	}

	return <Layout>

		<Title level={1} editable={{ onChange: handleTagUpdate }}>
			{tag.name}
		</Title>
		<Space wrap direction='horizontal'
			style={{
				display: 'flex',
				justifyContent: 'center'
			}}
		>
			<Popconfirm
				title={`Delete the category "${tag?.name}"`}
				description='Are you sure you want to delete this tag?'
				onConfirm={() => handleTagDeletion(tag.id)}
				okText='Yes'
				cancelText='No'
				disabled={tag.blogs.length}
			>
				<Button
					danger
					disabled={tag.blogs.length}
				>
					Delete the tag
				</Button>
			</Popconfirm>
			{tag.blogs.length ? <strong>
				You must delete all of {tag?.name}-related blogs before tag deletion.
			</strong> : null}
		</Space>
		<Divider />
		<BlogList
			headerText={`Published blogs under tag {${tag.name}}`}
			blogs={blogs.filter(blog => blog.isPublished)}
		/>

		<BlogList
			headerText={`Saved Drafts under tag {${tag.name}}`}
			blogs={blogs.filter(blog => !blog.isPublished)}
		/>
	</Layout>
}
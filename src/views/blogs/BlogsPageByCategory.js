import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Divider, Form, Layout, Spin } from 'antd';
import { useEffect, useState } from 'react';

import CategoryForm from '../../components/Category/CategoryForm';
import BlogList from '../../components/Blog/BlogList';
import { notifyError, notifySuccess } from '../../lib/openNotification';

import { updateCategoryImageRequest, updateCategoryRequest } from '../../services/categoryAPI';
import { categoryUpdated, fetchCategories, selectCategory } from '../../redux/sliceReducers/categoriesSlice';
import { selectToken } from '../../redux/sliceReducers/loggedAuthorSlice';
import { initializeBlogs, selectPublishedBlogs } from '../../redux/sliceReducers/blogsSlice';
import useImageUpload from '../../hooks/useImageUpload';

export default function BlogsPageByCategory() {
	const { categorySlug } = useParams();
	const dispatch = useDispatch();
	const authorToken = useSelector(selectToken);
	const category = useSelector(selectCategory(categorySlug));
	const publishedBlogs = useSelector(selectPublishedBlogs);
	const categoryStatus = useSelector(state => state.categories.status);
	const blogStatus = useSelector(state => state.blogs.status);
	const [form] = Form.useForm();

	const [blogsByCategory, setBlogsByCategory] = useState(null);
	const [errors, setErrors] = useState([]);
	const [uploadedImage, uploadedImageSetters] = useImageUpload();
	const [isDataSubmitting, setIsDataSubmitting] = useState(false);

	useEffect(() => {
		if (categoryStatus === 'idle') {
			dispatch(fetchCategories())
		}
		if (blogStatus === 'idle') {
			dispatch(initializeBlogs());
		}
	}, [dispatch, categoryStatus, blogStatus]);

	useEffect(() => {
		if (categoryStatus === 'succeeded' && blogStatus === 'succeeded') {
			const filteredBlogs = publishedBlogs.filter(blog => category.blogs.includes(blog.id));
			setBlogsByCategory(filteredBlogs);
		};
	}, [categoryStatus, blogStatus])

	const handleUpdate = async (values) => {
		setIsDataSubmitting(true);

		const updatedCategoryObject = {
			name: values.name,
			description: values.description
		}

		const credit = {
			authorName: values?.authorName || '',
			authorURL: values?.authorURL || '',
			sourceName: values?.sourceName || '',
			sourceURL: values?.sourceURL || ''
		}

		try {
			const imageData = await updateCategoryImageRequest({
				file: uploadedImage.file,
				existingImageId: uploadedImage.existingImageId,
				credit,
				categoryId: category.id
			}, authorToken)

			const data = await updateCategoryRequest({
				id: category.id,
				category: updatedCategoryObject,
			}, authorToken);

			if (imageData?.errors || data?.errors) {
				const errors = imageData?.errors || data?.errors;
				setErrors(errors.map(error => error.msg));
			} else if (imageData?.error || data?.error) {
				const error = imageData?.error || data?.error;
				setErrors([error]);
			} else {
				dispatch(categoryUpdated(data));
				notifySuccess(`Category "${values.name}" is successfully updated`);
				if (errors.length > 0) {
					setErrors([]);
				}
			}
		} catch (error) {
			notifyError(error);
		} finally {
			setIsDataSubmitting(false);
		}
	}

	if (blogsByCategory === null || blogStatus !== 'succeeded' || categoryStatus !== 'succeeded') {
		return <Spin />
	}

	return <Layout>
		<CategoryForm
			isEditing={true}
			category={category}
			handleSubmit={handleUpdate}
			form={form}
			uploadedImage={uploadedImage}
			uploadedImageSetters={uploadedImageSetters}
			isDataSubmitting={isDataSubmitting}
			errors={errors}
		/>
		<Divider />
		<BlogList
			headerText={`Blogs under category ${categorySlug}`}
			blogs={blogsByCategory}
		/>
	</Layout>
}
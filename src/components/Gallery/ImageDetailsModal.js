import { Button, Carousel, Form, Modal, Popconfirm, Space } from 'antd';
import { Fragment, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';

import { getImageUrl } from '../../services/helper';
import ImageCreditForm from '../Gallery/ImageCreditForm';
import { notifyError, notifySuccess } from '../../lib/openNotification';
import { deleteImageFileDocRequest, updateImageFileDocRequest } from '../../services/imageDocAPI';
import { selectToken } from '../../redux/sliceReducers/loggedAuthorSlice';
import { imageDocDeleted, imageDocUpdated } from '../../redux/sliceReducers/imageDocsSlice';

function SlideButton({
	slideCount,
	currentSlide,
	changeIndex,
	children,
	...props
}) {
	useEffect(() => {
		changeIndex(currentSlide);
	}, [changeIndex, currentSlide])
	return <span {...props}>{children}</span>
}

function ImageDetailsModal(props) {
	const {
		imageDocs,
		isModalOpen,
		closeModal,
		currentIndex,
		changeIndex,
	} = props;
	const dispatch = useDispatch();
	const authorToken = useSelector(selectToken);
	const [form] = Form.useForm();

	const [errors, setErrors] = useState([]);
	const [imageDoc, setImageDoc] = useState(imageDocs[currentIndex]);
	const [isDataSubmitting, setIsDataSubmitting] = useState(false);

	const bytesToKB = (bytes) => {
		const KB = (bytes / 1024).toFixed(2);
		return `${KB} KB`;
	}

	const bytesToMB = (bytes) => {
		const MB = (bytes / (1024 * 1024)).toFixed(2);
		return `${MB} MB`;
	}

	const formatFileSize = (bytes) => {
		return 1024 * 1024 < bytes ? bytesToMB(bytes) : bytesToKB(bytes);
	}

	const clearForm = () => {
		if (errors.length > 0) {
			setErrors([]);
		}
		form.resetFields()
	}

	const updateImageCredit = async (values) => {
		setIsDataSubmitting(true);
		try {
			const data = await updateImageFileDocRequest({
				imageId: imageDoc.id,
				credit: values,
				token: authorToken
			})

			if (data && data.errors) {
				setErrors(data.errors.map(error => (error.msg)));
			} else if (data && data.error) {
				setErrors([data.error]);
			} else if (data && !data.error && !data.errors) {
				dispatch(imageDocUpdated(data));
				notifySuccess('Image credit is successfully updated');
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

	function handleImageDocDeletion(id, token) {
		return async () => {
			try {
				await deleteImageFileDocRequest(id, token);
				dispatch(imageDocDeleted(id));
				notifySuccess(`${imageDoc.fileName} successfully deleted`);
				closeModal();
			} catch (error) {
				notifyError(error)
			}
		}
	}

	useEffect(() => {
		setImageDoc(imageDocs[currentIndex]);
	}, [currentIndex, imageDocs]);

	useEffect(() => {
		form.setFieldsValue({
			authorName: imageDocs[currentIndex].credit?.authorName || '',
			authorURL: imageDocs[currentIndex].credit?.authorURL || '',
			sourceName: imageDocs[currentIndex].credit?.sourceName || '',
			sourceURL: imageDocs[currentIndex].credit?.sourceURL || ''
		});
	}, [imageDoc, form])

	return (
		<Modal
			title={imageDoc.fileName}
			open={isModalOpen}
			width={500}
			onCancel={closeModal}
			footer={null}
			className='image-preview-modal'
		>
			<Carousel
				dots={false}
				arrows
				initialSlide={currentIndex}
				prevArrow={
					<SlideButton changeIndex={changeIndex}>
						<LeftOutlined />
					</SlideButton>
				}
				nextArrow={
					<SlideButton changeIndex={changeIndex}>
						<RightOutlined />
					</SlideButton>
				}
			>
				{
					imageDocs.map((doc) => (
						<Fragment key={doc.id}>
							<div className='carousel-image-wrapper'>
								<img
									src={getImageUrl(doc.id)}
									alt={`${doc.fileName}-${doc.id}`}
									className='carousel-image'
								/>
							</div>
						</Fragment>
					))
				}
			</Carousel >
			<Space size='small' direction='vertical' style={{ marginTop: '12px' }}>
				<Popconfirm
					title={`Delete ${imageDoc.fileName}`}
					onConfirm={handleImageDocDeletion(imageDoc.id, authorToken)}
					description='Are you sure to delete this image?'
					okText="Yes"
					cancelText="No"
				>
					<Button type="primary" danger>
						Delete
					</Button>
				</Popconfirm>
				<dl className='image-details'>
					<dt>File Name</dt>
					<dd>{imageDoc.fileName}</dd>
					<dt>File Type</dt>
					<dd>{imageDoc.fileType}</dd>
					<dt>File Size</dt>
					<dd>{formatFileSize(imageDoc.size)}</dd>
					<dt>Upload Date</dt>
					<dd>{moment(imageDoc.uploadDate).format('YYYY-MM-DD')}</dd>
				</dl>
				<ImageCreditForm
					form={form}
					handleSubmit={updateImageCredit}
					handleReset={clearForm}
					initialValues={imageDoc.credit}
					loading={isDataSubmitting}
					errors={errors}
				/>
			</Space>
		</Modal >
	)
}

export default ImageDetailsModal;
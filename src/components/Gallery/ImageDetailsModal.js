import { Carousel, Form, Modal } from 'antd';
import { useEffect, useState } from 'react';
import moment from 'moment';

import { getImageUrl } from '../../services/helper';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import ImageCreditFieldset from '../ImageUpload/ImageCreditFieldset';
import openNotification, { notifyError } from '../../lib/openNotification';
import { updateImageFileDocRequest } from '../../services/imageDocAPI';
import { selectToken } from '../../redux/sliceReducers/loggedAuthorSlice';
import { useDispatch, useSelector } from 'react-redux';
import { imageDocUpdated } from '../../redux/sliceReducers/imageDocsSlice';

function PrevArrow({ goPrev }) {
	return (
		<div className='slick-prev' onClick={goPrev}>
			<LeftOutlined />
		</div>
	)
}

function NextArrow({ goNext }) {
	return (
		<div className='slick-next' onClick={goNext}>
			<RightOutlined />
		</div>
	)
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

	const [imageDoc, setImageDoc] = useState(imageDocs[currentIndex]);
	const [isDataSubmitting, setIsDataSubmitting] = useState(false);
	// const [imageCreditErrors, setImageCreditErrors] = useState([]);

	const updateImageCredit = async (values) => {
		setIsDataSubmitting(true);
		try {
			const formData = new FormData();
			// formData.append('credit', JSON.stringify(values));
			formData.append('bs', 'you are reading this');
			const data = await updateImageFileDocRequest({
				imageId: imageDoc.id, body: formData
			}, authorToken)

			if (data && data.errors) {
				form.setFields(
					data.errors.map(error => ({ name: error.param, errors: [error.msg] }))
				);
			} else if (data && data.error) {
				form.setFields([{ name: 'errors', errors: [data.error] }]);
			} else if (data && !data.error && !data.errors) {
				dispatch(imageDocUpdated(data));
				openNotification({
					type: 'success',
					message: 'Successful operation',
					description: 'Image credit is successfully updated',
				});
			}
		} catch (error) {
			notifyError(error);
		} finally {
			setIsDataSubmitting(false);
		}
	}

	useEffect(() => {
		setImageDoc(imageDocs[currentIndex]);
	}, [currentIndex, imageDocs]);

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

	const goToSlider = (index) => {
		const totalImageDocs = imageDocs.length;
		const newIndex = index < 0 ? totalImageDocs - 1
			: index > totalImageDocs - 1 ? 0 : index;
		changeIndex(newIndex);
	}

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
				dotPosition='top'
				arrows
				initialSlide={currentIndex}
				prevArrow={<PrevArrow goPrev={() => goToSlider(currentIndex - 1)} />}
				nextArrow={<NextArrow goNext={() => goToSlider(currentIndex + 1)} />}
			>
				{
					imageDocs.map((doc) => (
						<div key={doc.id}>
							<img
								src={getImageUrl(doc.id)}
								alt={`${doc.fileName}-${doc.id}`}
								className='grid-image'
							/>
						</div>
					))
				}
			</Carousel>
			<div>
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
				<ImageCreditFieldset
					loading={isDataSubmitting}
					handleSubmit={updateImageCredit}
					form={form}
					initialValues={imageDoc.credit}
				/>
			</div>
		</Modal >
	)
}

export default ImageDetailsModal;
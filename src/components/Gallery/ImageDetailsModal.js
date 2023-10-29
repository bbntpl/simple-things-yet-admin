import { Modal } from 'antd';
import moment from 'moment';

import { getImageUrl } from '../../services/helper';

function ImageDetailsModal(props) {
	const { imageDoc, isModalOpen, closeModal } = props;

	const bytesToKB = (bytes) => {
		const KB = (bytes / 1024).toFixed(2);
		return `${KB} KB`;
	}

	const bytesToMB = (bytes) => {
		const MB = (bytes / (1024 * 1024)).toFixed(2);
		return `${MB} MB`;
	}

	const formatFileSize = (bytes) => {
		console.log(1024 * 1024, bytes)
		return 1024 * 1024 < bytes ? bytesToMB(bytes) : bytesToKB(bytes);
	}

	return (
		<Modal
			title={imageDoc.fileName}
			open={isModalOpen}
			width='90%'
			onCancel={closeModal}
		>
			<div>
				<img
					key={imageDoc.id}
					src={getImageUrl(imageDoc.id)}
					alt={`${imageDoc.fileName}-${imageDoc.id}`}
					className='grid-image'
				/>
				<div className='image-details'>
					<dl>
						<dt>File Name</dt>
						<dd>{imageDoc.fileName}</dd>
						<dt>File Type</dt>
						<dd>{imageDoc.fileType}</dd>
						<dt>File Size</dt>
						<dd>{formatFileSize(imageDoc.size)}</dd>
						<dt>Upload Date</dt>
						<dd>{moment(imageDoc.uploadDate).format('YYYY-MM-DD')}</dd>
					</dl>
				</div>
			</div>
		</Modal >
	)
}

export default ImageDetailsModal;
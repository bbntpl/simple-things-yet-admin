import { useState } from 'react';

import './styles.css';
import { getImageUrl } from '../../services/helper';
import ImageDetailsModal from './ImageDetailsModal';
import ImageDisplay from './ImageDisplay';

function ImageGrids(props) {
	const { imageDocs } = props;

	const [imageUrls, setImageUrls]
		= useState(imageDocs.map(doc => getImageUrl(doc.id)));
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [imagePreviewIndex, setImagePreviewIndex] = useState(0);

	const openModal = () => setIsModalOpen(true);
	const closeModal = () => setIsModalOpen(false);

	const handleImagePreview = (index) => {
		openModal();
		setImagePreviewIndex(index);
	}

	const switchImagePreviewIndex = (index) => {
		setImagePreviewIndex(index);
	}

	return (
		<div className='image-grid-container'>
			{
				imageDocs && imageDocs.length ?
					imageDocs.map((imageDoc, index) => (
						<ImageDisplay
							key={imageDoc.id}
							imageDoc={imageDoc}
							handleImagePreview={() => handleImagePreview(index)}
						/>
					)) : null
			}
			<ImageDetailsModal
				imageDoc={imageDocs[imagePreviewIndex]}
				isModalOpen={isModalOpen}
				closeModal={closeModal}
				setImagePreviewIndex={switchImagePreviewIndex} />
		</div>
	)
}

export default ImageGrids;
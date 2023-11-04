import { useState } from 'react';
import { Spin } from 'antd';

import './styles.css';
import useImageDocsWithSizes from '../../hooks/useImageDocsWithSizes';
import ImageDetailsModal from './ImageDetailsModal';
import ImageDisplay from './ImageDisplay';

function ImageGrids(props) {
	const { imageDocs } = props;

	const [isModalOpen, setIsModalOpen] = useState(false);
	const [imagePreviewIndex, setImagePreviewIndex] = useState(0);
	const [isLoading, setIsLoading] = useState(true);
	const [imageDocsWithSizes]
		= useImageDocsWithSizes(imageDocs, () => {
			setIsLoading(false);
		});

	const openModal = () => setIsModalOpen(true);
	const closeModal = () => setIsModalOpen(false);
	const changeIndex = (index) => setImagePreviewIndex(index);
	const handleImagePreview = (index) => {
		changeIndex(index);
		openModal();
	}

	if (isLoading) {
		return <Spin />
	}

	return (
		<div className='image-grid-container'>
			{
				imageDocsWithSizes && imageDocsWithSizes.length > 0 ?
					imageDocsWithSizes.map((imageDoc, index) => (
						<ImageDisplay
							key={imageDoc.id}
							imageDoc={imageDoc}
							handleClick={() => handleImagePreview(index)}
						/>
					)) : null
			}
			{
				// This component is conditionally displayed because the react slick
				// cannot be programatically change its index except by clicking arrows
				isModalOpen ?
					<ImageDetailsModal
						imageDocs={imageDocs}
						isModalOpen={isModalOpen}
						closeModal={closeModal}
						changeIndex={changeIndex}
						currentIndex={imagePreviewIndex}
					/> : null
			}
		</div>
	)
}

export default ImageGrids;
import { useEffect, useState } from 'react';

import './styles.css';
import { getImageUrl } from '../../services/helper';
import ImageDetailsModal from './ImageDetailsModal';
import ImageDisplay from './ImageDisplay';
import { Spin } from 'antd';

function ImageGrids(props) {
	const { imageDocs } = props;

	const [imageUrls, setImageUrls]
		= useState(imageDocs.map(doc => getImageUrl(doc.id)));

	const [imageDocsWithSizes, setImageDocsWithSizes] = useState([]);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [imagePreviewIndex, setImagePreviewIndex] = useState(0);
	const [isLoading, setIsLoading] = useState(true);

	const openModal = () => setIsModalOpen(true);
	const closeModal = () => setIsModalOpen(false);
	const changeIndex = (index) => setImagePreviewIndex(index);
	const handleImagePreview = (index) => {
		openModal();
		changeIndex(index);
	}

	useEffect(() => {
		const getImageSizes = async () => {
			const sizes = await Promise.all(
				imageDocs.map((doc) => {
					return new Promise((resolve) => {
						const img = new Image();
						img.src = getImageUrl(doc.id);
						img.alt = doc.fileName;
						img.onload = () => {
							resolve({
								...doc,
								url: img.src,
								width: img.width,
								height: img.height,
							});
						};
					});
				})
			);
			setImageDocsWithSizes(sizes);
			setIsLoading(false);
		};

		getImageSizes();
	}, [imageDocs]);

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
							handleImagePreview={() => handleImagePreview(index)}
						/>
					)) : null
			}
			<ImageDetailsModal
				imageDocs={imageDocs}
				isModalOpen={isModalOpen}
				closeModal={closeModal}
				changeIndex={changeIndex}
				currentIndex={imagePreviewIndex}
			/>
		</div>
	)
}

export default ImageGrids;
import { useEffect, useState } from 'react';
import { getImageUrl } from '../services/helper';
import { notifyError } from '../lib/openNotification';

export default function useImageDocsWithSizes(imageDocs, handleSuccess) {
	const [imageDocsWithSizes, setImageDocsWithSizes] = useState([]);

	const updateImageDocsWithSizes = async (imageDocs) => {
		try {
			const imagesWithSizes = await Promise.all(
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

			if (handleSuccess) {
				handleSuccess();
			}
			setImageDocsWithSizes(imagesWithSizes);
		} catch (error) {
			notifyError(error);
		}
	};

	useEffect(() => {
		updateImageDocsWithSizes(imageDocs, handleSuccess);
	}, [imageDocs]);

	return [imageDocsWithSizes, updateImageDocsWithSizes];
};
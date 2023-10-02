import { useCallback, useState } from 'react';
import { fetchBlob } from '../services/helper';
import { convertBlobToFile } from '../helpers/file-handling';

export default function useImageUpload() {
	const [uploadedImage, setUploadedImage] = useState({
		isLoading: false,
		previewTitle: '',
		isPreviewOpen: false,
		url: '',
		file: null,
	});

	const updateUploadedImage = useCallback((updates) => {
		setUploadedImage(prevState => ({ ...prevState, ...updates }));
	}, []);

	async function downloadImageAndUpdateSources(imageUrl) {
		try {
			const imageBlob = await fetchBlob(imageUrl);
			const file = convertBlobToFile(imageBlob);
			const url = URL.createObjectURL(imageBlob);
			updateUploadedImage({ url, file });
		} catch (error) {
			console.error('Error downloading image:', error);
		}
	}

	const uploadedImageSetters = {
		update: updateUploadedImage,
		downloadImageAndUpdateSources,
	};

	return [
		uploadedImage,
		uploadedImageSetters,
	];
}
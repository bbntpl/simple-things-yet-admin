import { useCallback, useState } from 'react';
import { fetchBlob } from '../services/helper';
import { convertBlobToFile } from '../helpers/file-handling';

const initialState = {
	isLoading: false,
	previewTitle: '',
	isPreviewOpen: false,
	url: '',
	file: null,
	existingImageId: null,
}

export default function useImageUpload() {
	const [uploadedImage, setUploadedImage] = useState(initialState);

	const updateUploadedImage = useCallback((updates) => {
		setUploadedImage(prevState => ({ ...prevState, ...updates }));
	}, []);

	async function downloadImageAndUpdateSources(imageUrl) {
		try {
			const imageBlob = await fetchBlob(imageUrl);
			const file = convertBlobToFile(imageBlob);
			const url = URL.createObjectURL(imageBlob);
			updateUploadedImage({
				url,
				file,
				existingImageId: null,
				previewTitle: file.name || file.url.substring(file.url.lastIndex('/') + 1)
			});
		} catch (error) {
			console.error('Error downloading image:', error);
		}
	}

	async function addExistingImageFromDB(params) {
		const { url, imageId, previewTitle } = params;
		updateUploadedImage({
			url,
			file: null,
			existingImageId: imageId,
			previewTitle: previewTitle || ''
		});
	}

	function resetUploadedImage() {
		setUploadedImage(initialState);
	}

	const uploadedImageSetters = {
		update: updateUploadedImage,
		downloadImageAndUpdateSources,
		reset: resetUploadedImage,
		addExistingImage: addExistingImageFromDB
	};

	return [
		uploadedImage,
		uploadedImageSetters,
	];
}
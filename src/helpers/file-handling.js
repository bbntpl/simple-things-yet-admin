import { notifyError } from '../lib/openNotification';

export function getBase64(file, callback) {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onload = () => {
			const result = reader.result;
			if (callback) {
				callback(reader.result);
			}
			resolve(result);
		};
		reader.onerror = error => {
			if (callback) {
				notifyError({ message: 'Fails to process file reading!' });
			}
			reject(error);
		};
		reader.readAsDataURL(file);
	});
}

export function areUploadReqsMet(file) {
	const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
	if (!isJpgOrPng) {
		notifyError({ message: 'You can only upload JPG/PNG file!' });
	}
	const isLt2M = file.size / 1024 / 1024 < 2;
	if (!isLt2M) {
		notifyError({ message: 'Image must be smaller than 2MB' })
	}
	return isJpgOrPng && isLt2M;
};

export function getImageExtension(mimeType) {
	const extensions = {
		'image/jpeg': '.jpg',
		'image/png': '.png',
	};
	return extensions[mimeType] || '';
};

export function convertBlobToFile(blob) {
	const extension = getImageExtension(blob.type);
	const fileName = `image${extension}`;
	const file = new File([blob], fileName, { type: blob.type, lastModified: Date.now() });
	return file;
}


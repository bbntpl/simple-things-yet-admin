import axiosInstance, { requestOptions } from './axiosInstance';

export async function fetchBlob(url) {
	const response = await axiosInstance.get(url, { responseType: 'blob' });
	return response.data;
}

export async function fetchImageRequest(endpoint) {
	const response = await axiosInstance.get(
		endpoint,
		requestOptions(null, { responseType: 'arraybuffer' })
	);

	return {
		data: response.data,
		mime: response.headers['content-type']
	};
}

export function getImageUrl(imageId) {
	return `${process.env.REACT_APP_API_URL}/images/${imageId}/source`;
}

export async function updateImageRequest(args) {
	const { file, existingImageId, token, formDataName, endpoint } = args;

	const formData = new FormData();
	formData.append(formDataName, file);
	formData.append('existingImageId', existingImageId || 'NULL')

	if (args?.credit) {
		formData.append('credit', JSON.stringify(args.credit))
	}

	const response = await axiosInstance.put(
		endpoint,
		formData,
		requestOptions(token, { 'Content-Type': 'multipart/form-data' }),
	);

	return response.data;

}
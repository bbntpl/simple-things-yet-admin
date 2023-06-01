import axiosInstance from './axiosInstance';

const baseURL = '/viewer';

export const fetchAllViewers = async () => {
	try {
		const response = await axiosInstance.get(`${baseURL}/all`);
		return response.data;
	} catch (error) {
		throw new Error(`${error} (during viewers fetch)`);
	}
}

export const fetchViewerByIdRequest = async (viewerId) => {
	try {
		const response = await axiosInstance.get(`${baseURL}/${viewerId}`);
		return response.data;
	} catch (error) {
		throw new Error(`${error} (during viewer fetch)`);
	}
}
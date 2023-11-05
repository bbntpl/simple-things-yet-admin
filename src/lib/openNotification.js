import { notification } from 'antd';

const openNotification = (options = {}) => {
	const {
		type = 'info',
		message = 'Successful operation',
		description = '',
		placement = 'bottomRight',
		duration = 2
	} = options;

	notification[type]({
		message,
		description,
		placement,
		duration
	});
};

export const notifyError = (error, message = 'Operation failed') => {
	openNotification({
		type: 'error',
		description: error.message,
		message
	})
}

export const notifySuccess = (message) => {
	openNotification({
		type: 'success',
		description: message,
		message: 'Successful operation'
	})
}

export default openNotification;
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

export default openNotification;
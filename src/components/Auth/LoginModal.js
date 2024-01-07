import { Modal } from 'antd';
import AuthForm from '../../components/Auth/AuthForm';

export default function LoginModal({ refreshTokenStatuses }) {
	return <>
		<Modal
			maskClosable={false}
			closeIcon={false}
			footer={null}
			open={true}
		>
			<AuthForm authFormType='relogin' onSuccess={refreshTokenStatuses} />
		</Modal >
	</>
}
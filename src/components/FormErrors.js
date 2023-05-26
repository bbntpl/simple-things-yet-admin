import { Alert } from 'antd';

export default function FormErrors({ errorMessages }) {
	const getErrorList = () => {
		return <ul>
			{
				errorMessages.map((err, index) => {
					return <li key={index}>{err.msg}</li>;
				})
			}
		</ul>
	}
	return <>
		{
			errorMessages.length !== 0 &&
			<Alert
				message={getErrorList()}
				type='error'
			/>
		}
	</>

}
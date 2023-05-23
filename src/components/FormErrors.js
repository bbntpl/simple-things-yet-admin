import { Alert } from 'antd';

export default function FormErrors({ errorMessages }) {
	const getErrorList = () => {
		return <ul>
			{
				errorMessages.map((err) => {
					return <li key={err.msg}>{err.msg}</li>;
				})
			}
		</ul>
	}
	return <>
		{
			errorMessages.length !== 0 &&
			<Alert
				message={<FormErrors errorMessages={getErrorList} />}
				type='error'
			/>
		}
	</>

}
import { Result, Button } from 'antd';
import { Link, useNavigate } from 'react-router-dom';

export default function NotFoundPage() {
	const navigate = useNavigate();

	return (
		<Result
			status='404'
			title='404'
			subTitle='Sorry, the page you visited does not exist.'
			extra={
				<>
					<Link to='/'>
						<Button type='primary'>
							Go to dashboard
						</Button>
					</Link>
					<Button type='dashed' onClick={() => navigate(-1)}>
						Go back
					</Button>
				</>
			}
		/>
	);
}
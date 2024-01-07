import { useLocation, useNavigate } from 'react-router-dom';

function GoBackButton() {
	const location = useLocation();
	const navigate = useNavigate();

	const isCurrentlyIndexPage = () => {
		return location.pathname === '/' || location.pathname === '/dashboard';
	}

	return (
		<>
			{isCurrentlyIndexPage() ? null : (
				<button
					onClick={() => navigate(-1)}
					style={{
						cursor: 'pointer',
						textDecoration: 'underline',
						width: 'max-content',
						backgroundColor: 'transparent',
						border: 0,
						margin: '1rem 1.5rem',
					}}
				>
					Go back
				</button>
			)}
		</>
	);
}

export default GoBackButton;
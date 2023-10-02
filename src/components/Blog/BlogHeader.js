import Title from 'antd/es/typography/Title';

export default function BlogHeader({ previewImage, title }) {
	const headerStyle = {
		background: `
      linear-gradient(
        to bottom,
        rgba(0, 0, 0, 0) 0%,
        rgba(0, 0, 0, 0.4) 100%
      ),
      url(${previewImage})`,
		backgroundSize: 'contain',
		backgroundRepeat: 'no-repeat',
		backgroundPosition: 'center',
		height: '200px',
		position: 'relative',
		margin: '2rem 0'
	};

	return (
		<div>
			<div style={headerStyle} />
			<Title level={1}>{title}</Title>
		</div>
	);
}
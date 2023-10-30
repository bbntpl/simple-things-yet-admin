import { Image } from 'antd';

import './styles.css';

function ImageDisplay(props) {
	const { handleImagePreview, imageDoc } = props;

	return (
		<Image
			preview={false}
			onClick={handleImagePreview || null}
			key={imageDoc.id}
			src={imageDoc.url}
			alt={`${imageDoc.fileName}-${imageDoc.id}`}
			className='grid-image'
			height={200 * (imageDoc.height / imageDoc.width)}
		/>
	)
}

export default ImageDisplay;
import { getImageUrl } from '../../services/helper';

import './styles.css';

function ImageDisplay(props) {
	const { handleImagePreview, imageDoc } = props;

	return (
		<img
			onClick={handleImagePreview || null}
			key={imageDoc.id}
			src={getImageUrl(imageDoc.id)}
			alt={`${imageDoc.fileName}-${imageDoc.id}`}
			className='grid-image'
		/>
	)
}

export default ImageDisplay;
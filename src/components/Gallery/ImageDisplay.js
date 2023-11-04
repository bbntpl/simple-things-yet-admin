import { Image } from 'antd';

import './styles.css';

function ImageDisplay(props) {
	const { handleClick, imageDoc } = props;

	return (
		<Image
			preview={false}
			onClick={handleClick || null}
			key={imageDoc.id}
			src={imageDoc.url}
			alt={`${imageDoc.fileName}-${imageDoc.id}`}
			className='grid-image'
			height={200 * (imageDoc.height / imageDoc.width)}
		/>
	)
}

export default ImageDisplay;
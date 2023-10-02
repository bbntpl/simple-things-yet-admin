import UploadButton from './UploadButton'

export default function UploadedImage(props) {
	const { imageUrl, isImageLoading, imageAltName } = props
	return (
		imageUrl ? <img
			src={imageUrl}
			alt={imageAltName}
			style={{
				height: 'auto',
				maxHeight: '100px',
				width: 'fit-content',
				maxWidth: '100%'
			}} /> : <UploadButton isImageLoading={isImageLoading} />
	)
}
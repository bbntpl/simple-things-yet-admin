import Title from 'antd/es/typography/Title';
import { useDispatch, useSelector } from 'react-redux';
import { imageDocAdded, selectImageDoc } from '../../redux/sliceReducers/imageDocsSlice';
import { useEffect, useState } from 'react';
import { fetchImageFileDocRequest } from '../../services/imageDocAPI';
import { notifyError } from '../../lib/openNotification';

function ImageCreditDisplay({ credit }) {
	return (
		<span>
			Photo{' '}
			{
				credit.authorName && credit.authorURL ?
					<span>
						by{' '}
						<a href={credit.authorURL} target='_blank' rel='noreferrer'>{credit.authorName}</a>
					</span>
					: null
			}
			{
				credit.sourceName && credit.sourceURL ?
					<span>
						{' '}on{' '}
						<a href={credit.sourceURL} target='_blank' rel='noreferrer'>{credit.sourceName}</a>
					</span>
					: null
			}
		</span>
	)
}

export default function BlogHeader({ previewImage, title, imageFileDocId }) {
	const selectedImageDoc = useSelector(selectImageDoc(imageFileDocId));
	const [currentImageDoc, setCurrentImageDoc] = useState(selectedImageDoc);
	const dispatch = useDispatch();
	const headerStyle = {
		background: `
      linear-gradient(
        to bottom,
        rgba(0, 21, 41, 0) 0%,
        rgba(0, 21, 41, 0.4) 100%
      ),
      url(${previewImage})`,
		backgroundSize: 'contain',
		backgroundRepeat: 'no-repeat',
		backgroundPosition: 'center',
		height: '200px',
		position: 'relative',
		margin: '2rem 0'
	};

	async function initializeCurrentImageDoc() {
		try {
			const data = await fetchImageFileDocRequest(imageFileDocId);
			if (!data?.error) {
				setCurrentImageDoc(data);
				dispatch(imageDocAdded(data));
			}
		} catch (error) {
			notifyError(error);
		}
	}

	useEffect(() => {
		if (!currentImageDoc) {
			initializeCurrentImageDoc();
		}
	}, [currentImageDoc])

	return (
		<div>
			<div style={headerStyle} />
			{
				currentImageDoc && <ImageCreditDisplay credit={currentImageDoc?.credit} />
			}
			<Title level={1}>{title}</Title>
		</div>
	);
}
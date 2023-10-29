import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ImageUploader from '../components/Gallery/ImageUploader';
import ImageGrids from '../components/Gallery/ImageGrids';
import { fetchImageDocs, selectImageDocs } from '../redux/sliceReducers/imageDocsSlice';
import { Spin } from 'antd';

function GalleryPage() {
	const dispatch = useDispatch();
	const imageDocs = useSelector(selectImageDocs);

	const imageDocStatus = useSelector(state => state.imageDocs.status);

	useEffect(() => {
		if (imageDocStatus === 'idle') {
			dispatch(fetchImageDocs());
		}
	}, [dispatch, imageDocStatus]);

	if (imageDocStatus !== 'succeeded') {
		return <Spin />
	};

	return (
		<div>
			<ImageUploader />
			{imageDocs && imageDocs.length > 0
				? <ImageGrids imageDocs={imageDocs} />
				: 'You haven\'t uploaded any images'
			}
		</div>
	)
}

export default GalleryPage;
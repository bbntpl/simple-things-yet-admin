import { useEffect, useState } from 'react';
import { Drawer, Spin } from 'antd';
import { useDispatch, useSelector } from 'react-redux';

import ImageDisplay from '../Gallery/ImageDisplay';
import useImageDocsWithSizes from '../../hooks/useImageDocsWithSizes';
import { fetchImageDocs, selectImageDocs } from '../../redux/sliceReducers/imageDocsSlice';

function ImagesDrawer(props) {
	const { isDrawerOpen, closeDrawer, addExistingImage } = props;

	const dispatch = useDispatch();
	const imageDocStatus = useSelector(state => state.imageDocs.status);
	const imageDocs = useSelector(selectImageDocs);
	const [isLoading, setIsLoading] = useState(true);
	const [imageDocsWithSizes]
		= useImageDocsWithSizes(imageDocs, () => {
			setIsLoading(false);
		})

	const handleClick = (params) => () => {
		addExistingImage(params);
		closeDrawer();
	}

	useEffect(() => {
		if (imageDocStatus === 'idle') {
			dispatch(fetchImageDocs());
		}
	}, [imageDocStatus, dispatch])

	if (isLoading) {
		return <Spin />
	}

	return (
		<Drawer
			title='Choose an existing image to upload'
			placement='bottom'
			closable={true}
			open={isDrawerOpen}
			onClose={closeDrawer}
			size='large'
		>
			<div className='image-grid-container'>
				{
					imageDocsWithSizes && imageDocsWithSizes.length > 0 ?
						imageDocsWithSizes.map((imageDoc) => (
							<ImageDisplay
								key={imageDoc.id}
								imageDoc={imageDoc}
								handleClick={handleClick({
									url: imageDoc.url,
									imageId: imageDoc.id,
									previewTitle: imageDoc.fileName
								})}
							/>
						)) : null
				}
			</div>
		</Drawer>
	)
}

export default ImagesDrawer;
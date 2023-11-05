import { useEffect, useState } from 'react';

import ImageUpload from './ImageUpload';
import { notifyError } from '../../lib/openNotification';
import { getImageUrl } from '../../services/helper';
import ImageCreditFieldset from './ImageCreditFieldset';
import { useSelector } from 'react-redux';
import { selectImageDoc } from '../../redux/sliceReducers/imageDocsSlice';
import { fetchImageFileDocRequest } from '../../services/imageDocAPI';

export default function ImageUploadFormItem(props) {
	const {
		formItemLabel,
		uploadedImageSetters,
		uploadedImage,
		uploadElName,
		document,
		form,
		showCreditFieldset = true
	} = props;

	const categoryImageDoc = useSelector(selectImageDoc(document?.imageFile || ''));
	const [uploadedImageDoc, setUploadedImageDoc] = useState(categoryImageDoc);

	const isCreditFieldsetDisabled = !uploadedImage.file && !uploadedImage.url;

	async function updateImageDoc(imageId) {
		try {
			const result = await fetchImageFileDocRequest(imageId);
			if (result?.error) {
				throw new Error('Image file doc not found');
			} else {
				setUploadedImageDoc(result);
			}
		} catch (error) {
			throw new Error(error.message);
		}
	}

	function initializeCreditInputs(imageDoc) {
		form.setFieldsValue({
			authorName: imageDoc?.credit.authorName || '',
			authorURL: imageDoc?.credit.authorURL || '',
			sourceName: imageDoc?.credit.sourceName || '',
			sourceURL: imageDoc?.credit.sourceURL || ''
		});
	}

	const updateDocImageFile = async () => {
		try {
			const url = getImageUrl(document.imageFile);
			await uploadedImageSetters.addExistingImage({
				url,
				imageId: document.imageFile,
			});
		} catch (err) {
			notifyError({ message: err.message });
		}
	}

	useEffect(() => {
		if (document && document?.imageFile && !uploadedImage.file) {
			(async () => await updateDocImageFile())();
		}
	}, [document])

	useEffect(() => {
		if (uploadedImage.existingImageId && showCreditFieldset) {
			(async () => await updateImageDoc(uploadedImage.existingImageId))();
		}
	}, [uploadedImage])

	useEffect(() => {
		if (uploadedImageDoc && showCreditFieldset) {
			initializeCreditInputs(uploadedImageDoc);
		}
	}, [uploadedImageDoc])

	return (
		<>
			<ImageUpload
				formItemLabel={formItemLabel}
				uploadedImage={uploadedImage}
				uploadedImageSetters={uploadedImageSetters}
				uploadElName={uploadElName}
			/>
			{
				showCreditFieldset && <ImageCreditFieldset
					disabled={isCreditFieldsetDisabled}
				/>
			}
		</>
	)
}
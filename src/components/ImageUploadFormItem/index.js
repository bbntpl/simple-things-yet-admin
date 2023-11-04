import { useEffect } from 'react';

import ImageUpload from './ImageUpload';
import { notifyError } from '../../lib/openNotification';
import { getImageUrl } from '../../services/helper';
import ImageCreditFieldset from './ImageCreditFieldset';

export default function ImageUploadFormItem(props) {
	const {
		formItemLabel,
		uploadedImageSetters,
		uploadedImage,
		uploadElName,
		document,
		showCreditFieldset = true
	} = props;

	const isCreditFieldsetDisabled = !uploadedImage.file && !uploadedImage.url;

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
		if (document && document.imageFile && !uploadedImage.file) {
			(async () => await updateDocImageFile())();
		}
	}, [document])

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
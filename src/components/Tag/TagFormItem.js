import { Checkbox, Form, Input } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { useRef, useState } from 'react';

import { createTagRequest } from '../../services/tagAPI';
import { tagAdded } from '../../redux/sliceReducers/tagsSlice';
import { notifyError } from '../../lib/openNotification';
import { selectToken } from '../../redux/sliceReducers/loggedAuthorSlice';

export default function TagFormItem({ blogTags }) {
	const dispatch = useDispatch();
	const authorToken = useSelector(selectToken);
	const tagInputRef = useRef(null);
	const [newTag, setNewTag] = useState('');

	const getTagOptions = (blogTags) => {
		return blogTags.map(tag => ({ label: tag.name, value: tag.name }));
	}

	const handleNewTagSubmit = async () => {
		try {
			const data = await createTagRequest({ name: newTag }, authorToken);
			if (data?.error) return;
			dispatch(tagAdded(data));
			setNewTag('');
			tagInputRef.current.focus();
		} catch (error) {
			notifyError(error);
		}
	}

	return (
		<Form.Item
			valuePropName='defaultValue'
			label='Tags'
			labelCol={{ span: 4 }}
			wrapperCol={{ span: 24 }}
		>
			<Form.Item
				name='tags'
				style={{
					display: 'grid',
					gridTemplateColumns: '1fr',
					alignItems: 'start'
				}}
			>
				<Checkbox.Group
					style={{ flexWrap: 'wrap' }}
					options={getTagOptions(blogTags)}
				/>
			</Form.Item>
			<Form.Item>
				<Input
					placeholder='new tag'
					style={{ width: '75px' }}
					onChange={(e) => setNewTag(e.target.value)}
					onPressEnter={handleNewTagSubmit}
					value={newTag}
					ref={tagInputRef}
				/>
			</Form.Item>
		</Form.Item>
	)
}
import { useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Space } from 'antd';
import Input from 'antd/es/input/Input';

import TagItem from './TagItem';
import { createTagRequest } from '../../services/tagAPI';
import { tagAdded } from '../../redux/sliceReducers/tagsSlice';
import { selectToken } from '../../redux/sliceReducers/loggedAuthorSlice';
import { notifyError } from '../../lib/openNotification';

export default function TagItemList({ tags }) {
	const dispatch = useDispatch();
	const [newTag, setNewTag] = useState('');
	const authorToken = useSelector(selectToken);
	const inputRef = useRef(null);

	const handleSubmit = () => {
		createTagRequest({ name: newTag }, authorToken)
			.then((result) => {
				if (result?.error) return;
				dispatch(tagAdded(result));
				setNewTag('');
				inputRef.current.focus();
			})
			.catch(err => {
				notifyError(err, 'Something wrong happened after submiting new tag: ')
			})
	}

	return <Space wrap>
		{
			tags.map(tag => {
				return <TagItem key={tag.id} tag={tag} />
			})
		}

		<Input
			placeholder='new tag'
			style={{ width: '75px' }}
			onChange={(e) => setNewTag(e.target.value)}
			onPressEnter={handleSubmit}
			value={newTag}
			ref={inputRef}
		/>
	</Space>
}
import { useState, useRef } from 'react';
import { Space } from 'antd';
import Input from 'antd/es/input/Input';
import { useDispatch, useSelector } from 'react-redux';

import TagItem from './TagItem';
import { createTagRequest } from '../../services/tagAPI';
import { createTagReducer } from '../../redux/sliceReducers/tagsSlice';
import { selectToken } from '../../redux/sliceReducers/loggedAuthorSlice';

export default function TagItemList({ tags }) {
	const dispatch = useDispatch();
	const [newTag, setNewTag] = useState('');
	const authorToken = useSelector(selectToken);
	const inputRef = useRef(null);

	const handleSubmit = () => {
		createTagRequest({ name: newTag }, authorToken)
			.then((result) => {
				if (result?.error) return;
				dispatch(createTagReducer(result));
				setNewTag('');
				inputRef.current.focus();
			})
			.catch(err => {
				console.log(err);
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
			style={{ width: '120px' }}
			onChange={(e) => setNewTag(e.target.value)}
			onPressEnter={handleSubmit}
			value={newTag}
			ref={inputRef}
		/>
	</Space>
}
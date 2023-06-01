import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { initializeViewers, selectViewers } from '../../redux/sliceReducers/viewersSlice';
import { Spin } from 'antd';
import ViewersContainer from '../../components/Viewer/ViewersContainer';

function ViewersPage() {
	const dispatch = useDispatch();
	const selectedViewers = useSelector(selectViewers) || null;

	useEffect(() => {
		dispatch(initializeViewers());
	}, [dispatch])

	if (!selectedViewers) {
		return <Spin />
	}

	return <div>
		<ViewersContainer viewers={selectedViewers} />
	</div>
}

export default ViewersPage;
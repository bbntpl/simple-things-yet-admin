import React from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { Button } from 'antd';

export default function NavButton({ text, navigateTo }) {
	const navigate = useNavigate();
	return <Button type='primary' onClick={() => navigate(navigateTo)}>
		{text}
	</Button>;
}

NavButton.propTypes = {
	text: PropTypes.string.isRequired,
	navigateTo: PropTypes.string.isRequired,
};
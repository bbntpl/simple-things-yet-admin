import React from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

export default function NavButton({ text, navigateTo }) {
	const navigate = useNavigate();
	return <button onClick={() => navigate(navigateTo)}>{text}</button>;
}

NavButton.propTypes = {
	text: PropTypes.string.isRequired,
	navigateTo: PropTypes.string.isRequired,
};
const removeItem = (name) => window.localStorage.removeItem(name);
const setItem = (name, item) => {
	const stringifiedItem = JSON.stringify(item);
	window.localStorage.setItem(name, stringifiedItem);
}
const getItem = (name) => JSON.parse(window.localStorage.getItem(name));

const LS = {
	removeItem,
	setItem,
	getItem
}

export default LS;

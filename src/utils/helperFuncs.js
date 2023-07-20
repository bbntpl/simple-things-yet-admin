export function getBase64(file) {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onload = () => resolve(reader.result);
		reader.onerror = error => reject(error);
		reader.readAsDataURL(file);
	});
}

// Map ids of MongoDB docs
export function extractIds({ docs, values, key }) {
	return docs.filter(doc => values.includes(doc[key]))
		.map(doc => doc.id);
}
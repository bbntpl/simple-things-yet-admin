// Map ids of MongoDB docs
export function extractIds({ docs, values, key }) {
	return docs.filter(doc => values.includes(doc[key])).map(doc => doc.id);
}
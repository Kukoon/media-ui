export function	uuidToArrayElement(id, a) {
	const i = parseInt(id.replace(/-/g, ""), 16);
	return a[i % a.length];
}

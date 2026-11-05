/** @type {import('./$types').PageLoad} */
export async function load({ fetch }) {
	const res = await fetch('/internships.json');
	if (!res.ok) {
		return {
			metadata: null,
			internships: []
		};
	}
	const data = await res.json();
	return {
		metadata: data.metadata || null,
		internships: Array.isArray(data.internships) ? data.internships : []
	};
}

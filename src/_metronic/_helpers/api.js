/**
 * Fetch data from given url
 * @param {*} url
 * @param {*} options
 */
const fetchJSON = (url, options = { headers: {} }) => {
	const token = localStorage.getItem("token");

	if (token) {
		options.headers["Authorization"] = `Bearer ${token}`;
	}

	return fetch(url, options)
		.then(response => {
			if (!response.status === 200) {
				throw response.json();
			}
			return response.json();
		})
		.then(json => {
			return json;
		})
		.catch(error => {
			throw error;
		});
};

export { fetchJSON };

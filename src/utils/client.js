import { APP } from 'src/constants/app';

/**
 * Makes an HTTP GET request to a given resource
 */
export async function httpGet(resource, options) {
	return fetch(resource, options);
}

/**
 * Builds a Headers object that the client can include with its HTTP requests
 * 
 * @returns {Object} A Headers object containing key-value pairs of headers
 */
export async function getClientHeaders() {
	const headers = new Headers();
	const apiKey = APP?.apiKey || import.meta.env.VITE_API_KEY || "66eaedcb-9315-4574-bc19-ae19506a07b0";
	if (apiKey) {
		headers.append("API-Key", apiKey);
		headers.append("X-API-Key", apiKey);
	}
	return headers;
}

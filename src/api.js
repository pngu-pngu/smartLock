/**
HOW TO CALL
import * as API from '../api.js';

await API.sponsorAPI.get()
await API.userAPI.post({ nickname: 'Brian' }
await driverAPI.patchById('driver001', { points: 150 }
**/

const BASE_URL = '';


function buildQueryParams(params) {
    console.log("Received params:", params);
    if (!params || Object.keys(params).length === 0) return ''; // Return empty if no params
    const queryString = new URLSearchParams(params).toString();
    console.log("Constructed query string:", queryString);  // Log the query string
    return `?${queryString}`;
}


// make a call to the api
//set default body to null and method to get
// Updated apiCall to include query parameters
async function apiCall(endpoint, method = 'GET', body = null, queryParams = null) {
    const options = {
        method,
        headers: {
            'Content-Type': 'application/json',
        },
    };

    if (body) options.body = JSON.stringify(body);

    const queryString = buildQueryParams(queryParams);
    const url = `${BASE_URL}${endpoint}${queryString}`;
    console.log("url", url);

    try {
        const response = await fetch(url, options);
        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        return response.json();
    } catch (error) {
        console.error('API call error:', error);
        throw error;
    }
}

// api ops
export async function get(endpoint, queryParams = null) {
    return apiCall(endpoint, 'GET', null, queryParams);
}
export async function post(endpoint, data) {
    return apiCall(endpoint, 'POST', data);
}

export async function patch(endpoint, data, queryParams = null) {
    return apiCall(endpoint, 'PATCH', data, queryParams);
}

export async function patchForAbigail(endpoint, data) {
    return apiCall(endpoint, 'PATCH', data);
}

export async function del(endpoint, queryParams = null) {
    return apiCall(endpoint, 'DELETE', null, queryParams);
}



// example api function
export const exampleAPI = {
    get: () => get('/example'),
    post: (data) => post('/example', data),
    getById: (id) => get(`/example/${id}`),
    deleteById: (id) => del(`/example/${id}`),
    patchById: (id, data) => patch(`/example/${id}`, data),
};

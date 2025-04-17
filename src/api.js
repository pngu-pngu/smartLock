/**
HOW TO CALL
import * as API from '../api.js';

await API.sponsorAPI.get()
await API.userAPI.post({ nickname: 'Brian' }
await driverAPI.patchById('driver001', { points: 150 }
**/
import axios from 'axios';

const BASE_URL = 'https://h7axj91rie.execute-api.us-east-1.amazonaws.com/dev';


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
    const queryString = queryParams ? `?${new URLSearchParams(queryParams).toString()}` : '';
    const url = `${BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}${queryString}`;

    console.log("API Call Details:", { method, url, body, queryParams });

    try {
        const response = await axios({
            method,
            url,
            data: body,
            headers: {
                'Content-Type': 'application/json',
            },
        });

        return response.data;
    } catch (error) {
        console.error('API call error:', error.response ? error.response.data : error);
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


export async function del(endpoint, queryParams = null) {
    return apiCall(endpoint, 'DELETE', null, queryParams);
}



// user api function
export const userAPI = {
    get: () => get('/user'),
    post: (data) => post('/user', data),
    getById: (id) => get(`/user/${id}`),
    getByUsername: (username) => get('/user', { user_username: username }),
    deleteById: (id) => del(`/user/${id}`),
    patchById: (id, data) => patch(`/user/${id}`, data),
};

// images api function
export const imagesAPI = {
    get: () => get('/Images'),
    post: (data) => post('/Images', data),
    getById: (id) => get(`/Images/${id}`),
    deleteById: (id) => del(`/Images/${id}`),
    patchById: (id, data) => patch(`/Images/${id}`, data),
};

// trusted api function
export const trustedAPI = {
    get: () => get('/Trusted'),
    post: (data) => post('/Trusted', data),
    getById: (id) => get(`/Trusted/${id}`),
    deleteById: (id) => del(`/Trusted/${id}`),
    patchById: (id, data) => patch(`/Trusted/${id}`, data),
};

// lock status *skeleton* api function
export async function getStatus() {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return {
      lock_status: Math.random() > 0.5 ? "Unlocked" : "Locked",
      battery_level: Math.floor(Math.random() * 41) + 60 // Random % between 60–100
    };
  }
import { clearUserData, getUserData } from '../util.js';

const host = 'http://localhost:3030';


async function request(method, url, data) {
    const options = {
        method,
        headers: {}
    };

    const user = getUserData();
    if (user) {
        options.headers['X-Authorization'] = user.accessToken;
    }

    if (data !== undefined) {
        options.headers['Content-Type'] = 'application.json';
        options.body = JSON.stringify(data);
    }

    try {
        const response = await fetch(host + url, options);

        if (response.status == 204) {
            return response;
        }

        const data = await response.json();

        if(response.ok == false) {
            if (response.status == 403) {
                clearUserData();
            }
            throw new Error(data.message);
        }

        return data;

    } catch (err) {
        alert(err.message);
        throw err;
    }
}

export const get = request.bind(null, 'get');
export const post = request.bind(null, 'post');
export const put = request.bind(null, 'put');
export const del = request.bind(null, 'delete');
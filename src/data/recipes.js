import { get } from './api.js';


const pageSize = 3;

const endpoints = {
    'recipes': '/data/recipes?sortBy=_createdOn%20desc',
    'byId': '/data/recipes/',
};

export async function getAll(page, query) {
    let dataUrl = endpoints.recipes;
    let sizeUrl = dataUrl;
    dataUrl += `&pageSize=${pageSize}&offset=${(page - 1) * pageSize}`;
    if (query) {
        dataUrl += `&where=${encodeURIComponent(`name LIKE "${query}"`)}`;
        sizeUrl += `&where=${encodeURIComponent(`name LIKE "${query}"`)}`;
    }
    sizeUrl += '&count';
    const [data, size] = await Promise.all([
        get(dataUrl),
        get(sizeUrl)
    ]);
    return {
        data,
        pages: Math.ceil(size / pageSize)
    };
}

window.getAll = getAll;

export async function getById(id) {
    return get(endpoints.byId + id);
}
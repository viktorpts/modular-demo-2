import { get, post } from './api.js';

const endpoints = {
    'commentsByRecipeId': (id) => `/data/comments?where=${encodeURIComponent(`recipeId="${id}"`)}&load=author%3D_ownerId%3Ausers`,
    'create': '/data/comments'
};


export async function getCommentsByRecipeId(recipeId) {
    return get(endpoints.commentsByRecipeId(recipeId));
}

export async function createComment(recipeId, content) {
    return await post(endpoints.create, { recipeId, content });
}
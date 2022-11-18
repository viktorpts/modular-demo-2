import { get, post } from './api.js';

const endpoints = {
    'likesByRecipeId': (id) => `/data/likes?where=${encodeURIComponent(`recipeId="${id}"`)}&count`,
    'likesByUserId': (recipeId, userId) => `/data/likes?where=${encodeURIComponent(`_ownerId="${userId}" AND recipeId="${recipeId}"`)}&count`,
    'likeRecipe': '/data/likes'
};


export async function getLikesByRecipeId(recipeId, userId) {
    const requests = [];

    requests.push(get(endpoints.likesByRecipeId(recipeId)));

    if (userId) {
        requests.push(get(endpoints.likesByUserId(recipeId, userId)));
    }

    const [likes, userLike] = await Promise.all(requests);

    return {
        likes,
        canLike: !userId || !userLike
    };
}

export async function likeRecipe(recipeId) {
    return await post(endpoints.likeRecipe, { recipeId });
}

window.getLikesByRecipeId = getLikesByRecipeId;
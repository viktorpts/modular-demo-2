import { html, until, nothing } from '../lib.js';
import { getById } from '../data/recipes.js';
import '../data/likes.js';
import { getLikesByRecipeId, likeRecipe } from '../data/likes.js';


const asyncTemplate = (recipePromise) => html`
${until(recipePromise, recipeSkeleton())}`;

const detailsTemplate = (recipe, likes, canLike, onLike) => html`
<h2>${recipe.name}</h2>
<div>
    ${canLike ? html`<a href="javascript:void(0)" @click=${onLike}>Like</a>` : nothing}
    ${likes} like${likes == 1 ? '' : 's'}
</div>
<img src=${'/' + recipe.img}>
<h3>Ingredients</h3>
<ul>
    ${recipe.ingredients.map(i => html`<li>${i}</li>`)}
</ul>
<h3>Preparation Step</h3>
<ul>
    ${recipe.steps.map(s => html`<li>${s}</li>`)}
</ul>
`;

const recipeSkeleton = () => html`
<h2>Recipe Details</h2>
<h3>Ingredients</h3>
<ul>
    Loading &hellip;
</ul>
<h3>Preparation Step</h3>
<ul>
    Loading &hellip;
</ul>
`;

export function showDetails(ctx) {
    const id = ctx.params.id;
    const user = ctx.user;
    let userId;
    if (user) {
        userId = user._id;
    }

    ctx.render(asyncTemplate(loadRecipe(id, userId, onLike)));

    async function onLike() {
        await likeRecipe(id);
        ctx.page.redirect('/recipes/' + id);
    }
}

async function loadRecipe(id, userId, onLike) {
    const { likes, canLike } = await getLikesByRecipeId(id, userId);

    const recipe = await getById(id);
    const isOwner = recipe._ownerId == userId;

    return detailsTemplate(recipe, likes, canLike && !isOwner, onLike);
}
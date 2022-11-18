import { html, until, nothing } from '../lib.js';
import { getById } from '../data/recipes.js';
import '../data/likes.js';
import { getLikesByRecipeId, likeRecipe } from '../data/likes.js';
import { createSubmitHandler } from '../util.js';
import { createComment, getCommentsByRecipeId } from '../data/comments.js';


const asyncTemplate = (recipePromise) => html`
${until(recipePromise, recipeSkeleton())}`;

const detailsTemplate = (recipe, likes, canLike, onLike, onComment, comments) => html`
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
<h3>Comments:</h3>
<ul>
    ${comments.map(c => html`<li>${c.author.username}: ${c.content}</li>`)}
</ul>
<div>
    <form @submit=${onComment}>
        <div>
            <textarea width="500" rows="10" name="content"></textarea>
        </div>
        <button>Post Comment</button>
    </form>
</div>
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

    ctx.render(asyncTemplate(loadRecipe(id, userId, onLike, createSubmitHandler(onComment))));

    async function onLike() {
        await likeRecipe(id);
        ctx.page.redirect('/recipes/' + id);
    }

    async function onComment({ content }) {
        await createComment(id, content);
        ctx.page.redirect('/recipes/' + id);
    }
}

async function loadRecipe(id, userId, onLike, onComment) {
    const [{ likes, canLike }, comments, recipe] = await Promise.all([
        getLikesByRecipeId(id, userId),
        getCommentsByRecipeId(id),
        getById(id)
    ]);

    const isOwner = recipe._ownerId == userId;

    return detailsTemplate(recipe, likes, canLike && !isOwner, onLike, onComment, comments);
}
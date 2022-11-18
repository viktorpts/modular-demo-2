import { html, nothing } from '../../node_modules/lit-html/lit-html.js';
import { repeat } from '../../node_modules/lit-html/directives/repeat.js';
import { getAll } from '../data/recipes.js';
import { createSubmitHandler } from '../util.js';


const catalogTemplate = (recipes, page, pages, search, onSubmit) => html`
<h2>Catalog</h2>
<div>
    <form @submit=${onSubmit}>
        <input name="search" type="text" .value=${search}>
        <button>Search</button>
    </form>
</div>
<div>
    ${page > 1 ? html`<a href=${composeUrl(page - 1, search)}>&lt; Prev</a>` : nothing}
    <span>Page ${page} / ${pages}</span>
    ${page < pages ? html`<a href=${composeUrl(page + 1, search)}>Next &gt;</a>` : nothing}
</div>
<ul>
    ${repeat(recipes, r => r._id, recipeCardTemplate)}
</ul>`;

const recipeCardTemplate = (recipe) => html`
<li><a href=${'/recipes/' + recipe._id}>${recipe.name}</a></li>`;


function composeUrl(page, search) {
    let url = `?page=${page}`;
    if (search) {
        url += '&search=' + search;
    }
    return url;
}


export async function showCatalog(ctx) {
    console.log(ctx.user);
    const page = Number(ctx.query.page) || 1;
    const search = ctx.query.search || '';

    ctx.render(html`<p>Loading &hellip;</p>`);
    const { data: recipes, pages } = await getAll(page, search);

    ctx.render(catalogTemplate(recipes, page, pages, search, createSubmitHandler(onSubmit)));

    function onSubmit(data, form) {
        ctx.page.redirect('/recipes?search=' + data.search);
    }
}


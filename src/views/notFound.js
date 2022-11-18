import { html } from '../../node_modules/lit-html/lit-html.js';


const notFoundTemplate = () => html`
<h2>404 Not Found</h2>`;


export function notFound(ctx) {
    ctx.render(notFoundTemplate());
}
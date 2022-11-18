import { html } from '../../node_modules/lit-html/lit-html.js';


const createTemplate = () => html`
<h2>Create Product</h2>`;

export function showCreate(ctx) {
    ctx.render(createTemplate());
}
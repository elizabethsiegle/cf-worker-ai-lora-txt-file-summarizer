/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

import html from '../static/index.html';
export default {
    async fetch(request, env) {
        const url = new URL(request.url);

        if (request.method === 'GET' && url.pathname === '/') {
            return new Response(html, {
                headers: { 'Content-Type': 'text/html' },
            });
        } else if (request.method === 'POST' && url.pathname === '/process-file') {
            const { content } = await request.json();
			console.log(`content ${content}`);
            // Process the file content as needed
            const answer = await env.AI.run('@cf/mistral/mistral-7b-instruct-v0.1',
			{
				// stream: true,
				raw: true,
				messages: [
				{
					"role": "user",
					"content": `Return a summary of the following: ${content}`
				}
				],
				lora: "cf-public-cnn-summarization"
			});
			console.log(`answer ${JSON.stringify(answer)}`)
            return new Response(JSON.stringify(answer["response"]), {
                headers: { 'Content-Type': 'application/json' },
            });
        }
        return new Response('Not found', { status: 404 });
    }
}

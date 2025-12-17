import { json } from '@sveltejs/kit';
import { GEMINI_API_KEY } from '$env/static/private';

export async function POST({ request }) {
	try {
		const { text, systemPrompt } = await request.json();

		const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${GEMINI_API_KEY}`;

		const payload = {
			contents: [
				{
					role: 'user',
					parts: [{ text: systemPrompt + '\n\nUsuário pergunta: ' + text }]
				}
			]
		};

		const response = await fetch(url, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(payload)
		});

		const data = await response.json();
		const aiResponse =
			data.candidates?.[0]?.content?.parts?.[0]?.text || 'Não consegui formular uma resposta.';

		return json({ text: aiResponse });
	} catch (error) {
		console.error('Erro no servidor:', error);
		return json({ text: 'Erro interno no servidor.' }, { status: 500 });
	}
}

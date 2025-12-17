<script lang="ts">
	import { onMount } from 'svelte';
	import { marked } from 'marked';
	import { fade, fly, slide } from 'svelte/transition';

	let isChatOpen = false;
	let userMessage = '';
	let isLoading = false;
	let chatElement: HTMLElement | null = null;

	let chatHistory = [
		{
			sender: 'ai',
			text: 'Olá! Sou a IA da Isabela. Pergunte-me sobre a experiência dela, projetos ou skills! 🚀'
		}
	];

	const projects = [
		{
			title: 'Reachout',
			status: 'Em Produção',
			desc: 'Plataforma SaaS para cardápios digitais e anúncios.',
			tags: ['React', 'Firebase'],
			link: 'https://www.viperise.com.br/reachout',
			icon: 'fas fa-utensils',
			color: 'from-orange-500 to-red-600',
			badgeColor: 'bg-green-500/20 text-green-400'
		},
		{
			title: 'Station One',
			status: 'WIP',
			desc: 'Extensão de browser "All-in-one" para produtividade.',
			tags: ['JavaScript', 'Chrome API'],
			link: 'https://github.com/isabela-lima/station-one',
			icon: 'fas fa-rocket',
			color: 'from-blue-500 to-cyan-500',
			badgeColor: 'bg-yellow-500/20 text-yellow-400'
		},
		{
			title: 'Viperise',
			status: 'Agency',
			desc: 'Minha agência de desenvolvimento e liderança técnica.',
			tags: ['Next.js', 'Liderança'],
			link: 'https://www.viperise.com.br/',
			icon: 'fas fa-code-branch',
			color: 'from-purple-600 to-indigo-700',
			badgeColor: 'bg-purple-500/20 text-purple-400'
		}
	];

	const systemPrompt = `
    Você é a 'Isabela AI', uma assistente virtual no portfólio da Engenheira de Software Isabela Lima.
    Responda em Português, seja amigável e profissional.
    Fatos: Founder da Viperise, Especialista em JS/Python/IA, Pós em IA na Prominas.
  `;

	function scrollToBottom() {
		setTimeout(() => {
			if (chatElement)
				(chatElement as HTMLElement).scrollTop = (chatElement as HTMLElement).scrollHeight;
		}, 50);
	}

	function sendSuggestion(text: string) {
		userMessage = text;
		handleChatSubmit();
	}
	async function handleChatSubmit() {
		if (!userMessage.trim()) return;

		const text = userMessage;
		userMessage = '';

		chatHistory = [...chatHistory, { sender: 'user', text }];
		isLoading = true;
		scrollToBottom();

		try {
			const response = await fetch('/api/chat', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },

				body: JSON.stringify({ text, systemPrompt })
			});

			const data = await response.json();

			chatHistory = [...chatHistory, { sender: 'ai', text: data.text }];
		} catch (error) {
			chatHistory = [
				...chatHistory,
				{ sender: 'ai', text: 'Erro de conexão. Tente novamente! 😓' }
			];
		} finally {
			isLoading = false;
			scrollToBottom();
		}
	}
</script>

<svelte:head>
	<link
		rel="stylesheet"
		href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css"
	/>
	<title>Isabela Lima | Engenheira de Software & Founder</title>
</svelte:head>

<div
	class="selection:bg-primary relative min-h-screen bg-slate-900 font-sans text-slate-100 antialiased selection:text-white"
>
	<nav class="fixed z-50 w-full border-b border-slate-700 bg-slate-900/90 backdrop-blur-md">
		<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
			<div class="flex h-16 items-center justify-between">
				<div class="shrink-0 text-xl font-bold tracking-wider text-indigo-500">
					ISABELA<span class="text-white">.LIMA</span>
				</div>
				<div class="hidden md:block">
					<div class="ml-10 flex items-baseline space-x-4">
						<a
							href="#about"
							class="rounded-md px-3 py-2 text-sm font-medium transition-colors hover:text-indigo-500"
							>Sobre</a
						>
						<a
							href="#projects"
							class="rounded-md px-3 py-2 text-sm font-medium transition-colors hover:text-indigo-500"
							>Projetos</a
						>
						<a
							href="#stack"
							class="rounded-md px-3 py-2 text-sm font-medium transition-colors hover:text-indigo-500"
							>Stack</a
						>
						<a
							href="#contact"
							class="rounded-full bg-indigo-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-600"
							>Contato</a
						>
					</div>
				</div>
			</div>
		</div>
	</nav>

	<section id="about" class="flex min-h-screen items-center justify-center pt-16">
		<div class="mx-auto flex max-w-7xl flex-col items-center px-4 sm:px-6 md:flex-row lg:px-8">
			<div class="mb-10 text-center md:mb-0 md:w-1/2 md:text-left">
				<div
					class="mb-4 inline-block rounded-full bg-emerald-400/10 px-3 py-1 text-xs font-semibold tracking-wider text-emerald-400 uppercase"
				>
					Open to Work & Projects
				</div>
				<h1 class="mb-6 text-4xl leading-tight font-bold md:text-6xl">
					Engenharia de Software <br />
					<span class="bg-linear-to-r from-indigo-500 to-purple-400 bg-clip-text text-transparent"
						>encontra a Inovação.</span
					>
				</h1>
				<p class="mx-auto mb-8 max-w-lg text-lg text-slate-400 md:mx-0">
					Olá! Sou a Isabela. Founder da Viperise e Engenheira Full Stack. Especialista em criar
					produtos digitais escaláveis com JavaScript, Python e IA.
				</p>
				<div class="flex flex-col justify-center gap-4 sm:flex-row md:justify-start">
					<a
						href="#projects"
						class="rounded-lg bg-indigo-500 px-8 py-3 text-center font-semibold text-white shadow-lg transition-all hover:bg-indigo-600 hover:shadow-indigo-500/50"
					>
						Ver Projetos
					</a>
					<button
						on:click={() => (isChatOpen = !isChatOpen)}
						class="group flex items-center justify-center gap-2 rounded-lg border border-slate-600 px-8 py-3 font-semibold text-slate-300 transition-all hover:border-indigo-500 hover:text-indigo-500"
					>
						<i class="fas fa-sparkles text-yellow-400 group-hover:animate-spin"></i> Chat com IA
					</button>
				</div>
			</div>

			<div class="relative flex justify-center md:w-1/2">
				<div
					class="absolute -inset-1 rounded-lg bg-linear-to-r from-indigo-500 to-purple-600 opacity-25 blur"
				></div>
				<div
					class="relative w-full max-w-md rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-md transition-transform duration-500 hover:scale-[1.02]"
				>
					<div class="mb-4 flex items-center gap-2 border-b border-slate-700 pb-2">
						<div class="h-3 w-3 rounded-full bg-red-500"></div>
						<div class="h-3 w-3 rounded-full bg-yellow-500"></div>
						<div class="h-3 w-3 rounded-full bg-green-500"></div>
						<span class="ml-auto text-xs text-slate-500">developer.py</span>
					</div>
					<pre class="overflow-x-auto font-mono text-sm text-green-400">
<code
							>class IsabelaLima:
def __init__(self):
    self.role = "Full Stack Engineer"
    self.focus = ["AI", "Fintech", "SaaS"]
    self.founder = "Viperise"

def build_future(self):
    return "Innovative Solutions"

print(IsabelaLima().build_future())</code
						></pre>
				</div>
			</div>
		</div>
	</section>

	<section id="projects" class="bg-slate-900 py-20">
		<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
			<h2 class="mb-12 text-center text-3xl font-bold">Projetos em Destaque</h2>

			<div class="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
				{#each projects as project}
					<div
						class="group overflow-hidden rounded-xl border border-slate-700 bg-slate-800 shadow-xl transition-transform duration-300 hover:-translate-y-2"
					>
						<div
							class={`h-48 bg-linear-to-br ${project.color} flex items-center justify-center transition-transform duration-500 group-hover:scale-105`}
						>
							<i class={`${project.icon} text-5xl text-white opacity-80`}></i>
						</div>
						<div class="p-6">
							<div class="mb-4 flex items-start justify-between">
								<h3 class="text-xl font-bold">{project.title}</h3>
								<span class={`px-2 py-1 ${project.badgeColor} rounded-full text-xs`}
									>{project.status}</span
								>
							</div>
							<p class="mb-4 text-sm text-slate-400">{project.desc}</p>
							<div class="mb-6 flex flex-wrap gap-2">
								{#each project.tags as tag}
									<span class="rounded bg-slate-700 px-2 py-1 text-xs text-slate-300">{tag}</span>
								{/each}
							</div>
							<a
								href={project.link}
								target="_blank"
								class="flex items-center gap-1 text-sm font-semibold text-indigo-500 hover:text-indigo-400"
							>
								Acessar <i class="fas fa-external-link-alt text-xs"></i>
							</a>
						</div>
					</div>
				{/each}
			</div>
		</div>
	</section>

	<section id="stack" class="bg-slate-800/50 py-20">
		<div class="mx-auto max-w-4xl px-4 text-center">
			<h2 class="mb-12 text-3xl font-bold">Tech Stack & Tools</h2>
			<div class="grid grid-cols-2 gap-8 md:grid-cols-4">
				<div
					class="rounded-lg border border-slate-700 bg-slate-800 p-4 transition-colors hover:border-indigo-500"
				>
					<i class="fab fa-python mb-2 text-4xl text-blue-400"></i>
					<p class="font-semibold">Python</p>
				</div>
				<div
					class="rounded-lg border border-slate-700 bg-slate-800 p-4 transition-colors hover:border-indigo-500"
				>
					<i class="fab fa-js mb-2 text-4xl text-yellow-400"></i>
					<p class="font-semibold">JavaScript</p>
				</div>
				<div
					class="rounded-lg border border-slate-700 bg-slate-800 p-4 transition-colors hover:border-indigo-500"
				>
					<i class="fab fa-react mb-2 text-4xl text-cyan-400"></i>
					<p class="font-semibold">React/Native</p>
				</div>
				<div
					class="rounded-lg border border-slate-700 bg-slate-800 p-4 transition-colors hover:border-indigo-500"
				>
					<i class="fas fa-brain mb-2 text-4xl text-pink-500"></i>
					<p class="font-semibold">AI / ML</p>
				</div>
			</div>
		</div>
	</section>

	<footer id="contact" class="border-t border-slate-800 bg-slate-900 py-12">
		<div class="mx-auto max-w-7xl px-4 text-center">
			<h2 class="mb-6 text-2xl font-bold">Vamos construir algo incrível?</h2>
			<div class="mb-8 flex justify-center gap-6">
				<a
					href="https://github.com/isabela-lima"
					target="_blank"
					aria-label="GitHub"
					class="text-2xl text-slate-400 transition-colors hover:text-white"
					><i class="fab fa-github"></i></a
				>
				<a
					href="https://linkedin.com/in/isabela-lima1"
					target="_blank"
					aria-label="LinkedIn"
					class="text-2xl text-slate-400 transition-colors hover:text-white"
					><i class="fab fa-linkedin"></i></a
				>
				<a
					href="mailto:isabelamslimas@gmail.com"
					target="_blank"
					aria-label="Email"
					class="text-2xl text-slate-400 transition-colors hover:text-white"
					><i class="fas fa-envelope"></i></a
				>
			</div>
			<p class="text-sm text-slate-600">&copy; 2025 Isabela Lima. All rights reserved.</p>
		</div>
	</footer>

	{#if !isChatOpen}
		<button
			in:fade
			out:fade
			on:click={() => (isChatOpen = true)}
			aria-label="Abrir chat com IA"
			class="animate-bounce-slow fixed right-6 bottom-6 z-50 rounded-full bg-indigo-500 p-4 text-white shadow-2xl transition-transform hover:scale-110 hover:bg-indigo-600"
		>
			<i class="fas fa-sparkles text-xl"></i>
		</button>
	{/if}

	{#if isChatOpen}
		<div
			transition:fly={{ y: 200, duration: 300 }}
			class="fixed right-6 bottom-24 z-50 flex h-[500px] w-96 flex-col overflow-hidden rounded-2xl border border-slate-700 bg-slate-900/95 shadow-2xl backdrop-blur-xl"
		>
			<div
				class="flex items-center justify-between bg-linear-to-r from-indigo-500 to-purple-600 p-4"
			>
				<div class="flex items-center gap-3">
					<div class="flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
						<i class="fas fa-robot text-sm text-white"></i>
					</div>
					<div>
						<h3 class="text-sm font-bold text-white">Isabela AI ✨</h3>
						<p class="flex items-center gap-1 text-xs text-indigo-200">
							<span class="h-2 w-2 animate-pulse rounded-full bg-green-400"></span> Online
						</p>
					</div>
				</div>
				<button
					on:click={() => (isChatOpen = false)}
					aria-label="Fechar chat com IA"
					aria-hidden="true"
					class="text-white/80 hover:text-white"
				>
					<i class="fas fa-times"></i>
				</button>
			</div>

			<div
				bind:this={chatElement}
				class="flex-1 space-y-4 overflow-y-auto scroll-smooth bg-slate-900/50 p-4"
				role="region"
				aria-label="Histórico do chat com IA"
			>
				{#each chatHistory as msg}
					<div class={`flex items-start gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}>
						<div
							class={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border ${msg.sender === 'user' ? 'border-transparent bg-slate-700' : 'border-indigo-500/30 bg-indigo-500/20'}`}
						>
							<i
								class={`fas ${msg.sender === 'user' ? 'fa-user text-slate-300' : 'fa-robot text-indigo-500'} text-xs`}
							></i>
						</div>
						<div
							class={`max-w-[80%] rounded-2xl p-3 text-sm leading-relaxed ${msg.sender === 'user' ? 'rounded-tr-none bg-indigo-500 text-white' : 'rounded-tl-none border border-slate-700 bg-slate-800 text-slate-300'}`}
						>
							{@html marked(msg.text)}
						</div>
					</div>
				{/each}

				{#if isLoading}
					<div class="flex items-start gap-3">
						<div
							class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-indigo-500/30 bg-indigo-500/20"
						>
							<i class="fas fa-robot text-xs text-indigo-500"></i>
						</div>
						<div
							class="flex h-10 items-center gap-1 rounded-2xl rounded-tl-none border border-slate-700 bg-slate-800 p-4"
						>
							<div class="h-2 w-2 animate-bounce rounded-full bg-slate-500"></div>
							<div class="h-2 w-2 animate-bounce rounded-full bg-slate-500 delay-75"></div>
							<div class="h-2 w-2 animate-bounce rounded-full bg-slate-500 delay-150"></div>
						</div>
					</div>
				{/if}
			</div>

			{#if chatHistory.length === 1}
				<div class="no-scrollbar flex gap-2 overflow-x-auto bg-slate-900/50 px-4 py-2">
					<button
						on:click={() => sendSuggestion('Quais são seus projetos principais?')}
						class="rounded-full border border-slate-700 bg-slate-800 px-3 py-1 text-xs whitespace-nowrap text-slate-400 transition-colors hover:bg-slate-700"
					>
						🏆 Projetos
					</button>
					<button
						on:click={() => sendSuggestion('Conte sobre sua experiência em IA.')}
						class="rounded-full border border-slate-700 bg-slate-800 px-3 py-1 text-xs whitespace-nowrap text-slate-400 transition-colors hover:bg-slate-700"
					>
						🤖 Exp. em IA
					</button>
				</div>
			{/if}

			<div class="border-t border-slate-700 bg-slate-800/50 p-4">
				<form on:submit|preventDefault={handleChatSubmit} class="relative flex gap-2">
					<input
						bind:value={userMessage}
						type="text"
						placeholder="Digite sua pergunta..."
						class="w-full rounded-full border border-slate-700 bg-slate-900 px-4 py-2 pr-10 text-sm text-white focus:border-indigo-500 focus:outline-none"
					/>
					<button
						type="submit"
						disabled={isLoading || !userMessage.trim()}
						aria-label="Enviar mensagem"
						class="absolute top-1 right-2 flex h-8 w-8 items-center justify-center rounded-full bg-indigo-500 text-white transition-colors hover:bg-indigo-600 disabled:cursor-not-allowed disabled:opacity-50"
					>
						<i class="fas fa-paper-plane text-xs"></i>
					</button>
				</form>
			</div>
		</div>
	{/if}
</div>

<style>
	.no-scrollbar::-webkit-scrollbar {
		display: none;
	}
	.no-scrollbar {
		-ms-overflow-style: none;
		scrollbar-width: none;
	}
</style>

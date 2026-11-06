<script>
	import './layout.css';
	import favicon from '#lib/assets/favicon.svg';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<div class="flex min-h-svh flex-col">
	<div class="container mx-auto w-full max-w-5xl flex-grow px-6">
		{@render children()}
	</div>
	<footer class="container mx-auto mt-12 w-full max-w-5xl px-6 pb-4 sm:pb-5">
		<span class="font-display text-[0.625rem] tracking-[0.08em] text-neutral-400 uppercase"
			>&copy; 2026 Dean Gao</span
		>
	</footer>
</div>

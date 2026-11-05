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
	<div class="footer w-full">
		<div class="mx-auto mt-12 w-32 sm:mb-4">
			<span class="text-xs text-gray-400">&copy; 2026 Dean Gao</span>
		</div>
	</div>
</div>

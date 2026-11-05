<script>
	import { page } from '$app/state';
	import Back from '#lib/components/Back.svelte';

	const is404 = $derived(page.status === 404);
	const status = $derived(page.status || 404);

	const heading = $derived(
		is404
			? page.error?.message && page.error.message !== 'Not Found'
				? page.error.message
				: 'Page not found'
			: 'Something went wrong'
	);

	const description = $derived(
		is404
			? "The page you're looking for doesn't exist, has been moved, or is temporarily unavailable."
			: page.error?.message || 'An unexpected error occurred.'
	);
</script>

<svelte:head>
	<title>{status} · {is404 ? 'Page Not Found' : 'Error'}</title>
</svelte:head>

<Back href="https://gaodean.com" />

<main class="max-w-xl">
	<div
		class="font-display text-xs font-semibold tracking-[0.06em] text-stone uppercase"
		style="font-family: var(--font-display);"
	>
		{status}
	</div>

	<h1
		class="mt-2 font-display text-2xl font-bold tracking-[-0.03em] text-neutral-900 sm:text-3xl"
		style="font-family: var(--font-display);"
	>
		{heading}
	</h1>

	<p
		class="mt-4 text-[0.9375rem] leading-relaxed text-neutral-600 sm:text-base"
		style="font-family: var(--font-sans-serif);"
	>
		{description}
	</p>

	<div class="mt-8 flex items-center gap-6 text-sm" style="font-family: var(--font-sans-serif);">
		<a href="https://gaodean.com" class="text-accent no-underline underline-offset-4 hover:underline"
			><span class="mr-1">→</span>home</a
		>

		<a
			href="https://github.com/gaodean"
			class="text-stone no-underline underline-offset-4 hover:text-accent hover:underline"
		>
			github
		</a>
	</div>
</main>

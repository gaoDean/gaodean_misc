<script>
	let props = $props();
</script>

<div class="mt-6 mb-12">
	<a
		href={props.href ? props.href : '/'}
		class="font-display text-xs text-stone hover:text-accent"
		style="font-family: var(--font-display);"
	>
		← Back
	</a>
</div>

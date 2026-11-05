<script>
	let { data } = $props();

	let searchQuery = $state('');
	let selectedDiscipline = $state('All');
	let sortBy = $state('date-desc');

	const internships = $derived(data.internships ?? []);
	const metadata = $derived(data.metadata);

	const disciplines = $derived.by(() => {
		const counts = new Map();
		for (const item of internships) {
			if (!item.discipline) continue;
			const parts = item.discipline.split('/').map((s) => s.trim());
			for (const p of parts) {
				if (p) counts.set(p, (counts.get(p) || 0) + 1);
			}
		}
		const sorted = Array.from(counts.entries())
			.sort((a, b) => b[1] - a[1])
			.filter(([_, count]) => count >= 2)
			.map(([name]) => name);
		return ['All', ...sorted];
	});

	const filtered = $derived.by(() => {
		let list = internships;
		const q = searchQuery.trim().toLowerCase();

		if (q) {
			list = list.filter((item) => {
				const title = (item.title || '').toLowerCase();
				const company = (item.company || '').toLowerCase();
				const discipline = (item.discipline || '').toLowerCase();
				const location = (item.location || '').toLowerCase();
				const notes = (item.notes || '').toLowerCase();
				return (
					title.includes(q) ||
					company.includes(q) ||
					discipline.includes(q) ||
					location.includes(q) ||
					notes.includes(q)
				);
			});
		}

		if (selectedDiscipline !== 'All') {
			const target = selectedDiscipline.toLowerCase();
			list = list.filter(
				(item) => item.discipline && item.discipline.toLowerCase().includes(target)
			);
		}

		const result = [...list];
		if (sortBy === 'date-desc') {
			result.sort((a, b) => (b.date_found || '').localeCompare(a.date_found || ''));
		} else if (sortBy === 'date-asc') {
			result.sort((a, b) => (a.date_found || '').localeCompare(b.date_found || ''));
		} else if (sortBy === 'company') {
			result.sort((a, b) => (a.company || '').localeCompare(b.company || ''));
		} else if (sortBy === 'title') {
			result.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
		}
		return result;
	});

	function formatDate(dateStr) {
		if (!dateStr) return '—';
		try {
			const d = new Date(dateStr + (dateStr.includes('T') ? '' : 'T00:00:00'));
			return d.toLocaleDateString('en-AU', {
				day: 'numeric',
				month: 'short'
			});
		} catch {
			return dateStr;
		}
	}

	function formatDateTime(isoStr) {
		if (!isoStr) return '';
		try {
			const d = new Date(isoStr);
			return d.toLocaleDateString('en-AU', {
				day: 'numeric',
				month: 'short',
				year: 'numeric'
			});
		} catch {
			return isoStr;
		}
	}
</script>

<svelte:head>
	<title>Engineering Internships · Dean Gao</title>
	<meta name="robots" content="noindex, nofollow" />
</svelte:head>

<header class="pt-8 sm:pt-12 mb-8">
	<h1
		class="text-3xl font-bold tracking-[-0.03em] text-neutral-900 sm:text-4xl"
		style="font-family: var(--font-display);"
	>
		Internships
	</h1>

	<div
		class="mt-2 flex flex-wrap items-baseline gap-x-3 gap-y-1 text-sm text-stone"
		style="font-family: var(--font-sans-serif);"
	>
		<span>Melbourne &amp; Victoria, Australia</span>
		{#if metadata?.last_run}
			<span aria-hidden="true" class="text-neutral-300">·</span>
			<span>Updated daily at 8:00 AM (last run: {formatDateTime(metadata.last_run)})</span>
		{/if}
		<span aria-hidden="true" class="text-neutral-300">·</span>
		<span>{internships.length} opportunities logged</span>
	</div>
</header>

<!-- Filter & Search Toolbar -->
<section
	class="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
	aria-label="Filter and search internships"
>
	<div class="relative flex-1 sm:max-w-xs">
		<input
			type="search"
			bind:value={searchQuery}
			placeholder="Search roles, companies, keywords…"
			class="w-full rounded border border-neutral-200 bg-white px-3 py-1.5 text-xs text-neutral-800 transition-colors placeholder:text-neutral-400 focus:border-neutral-400 focus:outline-none"
			style="font-family: var(--font-sans-serif);"
		/>
		{#if searchQuery}
			<button
				type="button"
				onclick={() => (searchQuery = '')}
				class="absolute top-1/2 right-2 -translate-y-1/2 text-xs text-neutral-400 hover:text-neutral-700"
				aria-label="Clear search"
			>
				✕
			</button>
		{/if}
	</div>

	<div class="flex flex-wrap items-center gap-2">
		<!-- Discipline select -->
		<label class="flex items-center gap-1.5 text-xs text-stone" style="font-family: var(--font-display);">
			<span class="uppercase tracking-wider">Discipline</span>
			<select
				bind:value={selectedDiscipline}
				class="rounded border border-neutral-200 bg-white px-2 py-1 text-xs text-neutral-800 transition-colors focus:border-neutral-400 focus:outline-none"
				style="font-family: var(--font-sans-serif);"
			>
				{#each disciplines as disc}
					<option value={disc}>{disc}</option>
				{/each}
			</select>
		</label>

		<!-- Sort select -->
		<label class="flex items-center gap-1.5 text-xs text-stone" style="font-family: var(--font-display);">
			<span class="uppercase tracking-wider">Sort</span>
			<select
				bind:value={sortBy}
				class="rounded border border-neutral-200 bg-white px-2 py-1 text-xs text-neutral-800 transition-colors focus:border-neutral-400 focus:outline-none"
				style="font-family: var(--font-sans-serif);"
			>
				<option value="date-desc">Newest First</option>
				<option value="date-asc">Oldest First</option>
				<option value="company">Company (A-Z)</option>
				<option value="title">Role Title (A-Z)</option>
			</select>
		</label>
	</div>
</section>

<!-- Table Stats -->
<div class="mb-3 flex items-baseline justify-between text-xs text-stone" style="font-family: var(--font-sans-serif);">
	<span>
		Showing {filtered.length} of {internships.length} {filtered.length === 1 ? 'role' : 'roles'}
		{#if searchQuery || selectedDiscipline !== 'All'}
			<span>(filtered)</span>
		{/if}
	</span>
	{#if searchQuery || selectedDiscipline !== 'All'}
		<button
			type="button"
			onclick={() => {
				searchQuery = '';
				selectedDiscipline = 'All';
			}}
			class="text-accent underline-offset-2 hover:underline"
		>
			Reset filters
		</button>
	{/if}
</div>

<!-- Table Display -->
{#if filtered.length === 0}
	<div
		class="rounded border border-dashed border-neutral-200 py-12 text-center text-sm text-stone"
		style="font-family: var(--font-sans-serif);"
	>
		No internships matched your query.
		<button
			type="button"
			onclick={() => {
				searchQuery = '';
				selectedDiscipline = 'All';
			}}
			class="ml-1 text-accent underline hover:no-underline"
		>
			Reset filters
		</button>
	</div>
{:else}
	<div class="overflow-x-auto rounded border border-neutral-200 bg-white">
		<table class="w-full border-collapse text-left text-sm" style="font-family: var(--font-sans-serif);">
			<thead>
				<tr class="border-b border-neutral-200 bg-neutral-50/60">
					<th
						scope="col"
						class="py-2.5 pr-4 pl-4 text-xs font-semibold tracking-wider text-neutral-600 uppercase"
						style="font-family: var(--font-display);"
					>
						Role &amp; Details
					</th>
					<th
						scope="col"
						class="py-2.5 pr-4 pl-3 text-xs font-semibold tracking-wider text-neutral-600 uppercase"
						style="font-family: var(--font-display);"
					>
						Company
					</th>
					<th
						scope="col"
						class="hidden py-2.5 pr-4 pl-3 text-xs font-semibold tracking-wider text-neutral-600 uppercase md:table-cell"
						style="font-family: var(--font-display);"
					>
						Discipline
					</th>
					<th
						scope="col"
						class="hidden py-2.5 pr-4 pl-3 text-xs font-semibold tracking-wider text-neutral-600 uppercase lg:table-cell"
						style="font-family: var(--font-display);"
					>
						Location
					</th>
					<th
						scope="col"
						class="py-2.5 pr-4 pl-3 text-right text-xs font-semibold tracking-wider text-neutral-600 uppercase"
						style="font-family: var(--font-display);"
					>
						Added
					</th>
					<th
						scope="col"
						class="py-2.5 pr-4 pl-3 text-right text-xs font-semibold tracking-wider text-neutral-600 uppercase"
						style="font-family: var(--font-display);"
					>
						Link
					</th>
				</tr>
			</thead>
			<tbody class="divide-y divide-neutral-100">
				{#each filtered as item (item.url || item.title + item.company)}
					<tr class="transition-colors hover:bg-neutral-50/70">
						<!-- Role & Notes -->
						<td class="py-3 pr-4 pl-4 align-top">
							<a
								href={item.url}
								target="_blank"
								rel="noopener noreferrer"
								class="font-medium text-neutral-900 underline-offset-2 hover:text-accent hover:underline"
							>
								{item.title}
							</a>
							{#if item.notes}
								<p class="mt-1 line-clamp-2 text-xs text-neutral-500 leading-snug">
									{item.notes}
								</p>
							{/if}
							<!-- Mobile-only secondary info -->
							<div class="mt-1.5 flex flex-wrap gap-x-2 text-xs text-stone md:hidden">
								{#if item.discipline}
									<span>{item.discipline}</span>
								{/if}
								{#if item.location}
									<span aria-hidden="true">·</span>
									<span>{item.location}</span>
								{/if}
							</div>
						</td>

						<!-- Company -->
						<td class="py-3 pr-4 pl-3 align-top whitespace-nowrap text-neutral-800">
							<span class="font-medium">{item.company}</span>
							{#if item.source_type}
								<span class="block text-[0.7rem] text-stone">
									{item.source_type}
								</span>
							{/if}
						</td>

						<!-- Discipline -->
						<td class="hidden py-3 pr-4 pl-3 align-top text-xs text-neutral-700 md:table-cell">
							{item.discipline || '—'}
						</td>

						<!-- Location -->
						<td class="hidden py-3 pr-4 pl-3 align-top text-xs text-neutral-600 lg:table-cell">
							{item.location || 'Melbourne, VIC'}
						</td>

						<!-- Date Found -->
						<td class="py-3 pr-4 pl-3 text-right align-top whitespace-nowrap text-xs text-stone">
							{formatDate(item.date_found)}
						</td>

						<!-- Link -->
						<td class="py-3 pr-4 pl-3 text-right align-top whitespace-nowrap">
							<a
								href={item.url}
								target="_blank"
								rel="noopener noreferrer"
								class="text-xs text-accent underline-offset-2 hover:underline"
								aria-label={`Apply for ${item.title} at ${item.company}`}
							>
								Apply &rarr;
							</a>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
{/if}

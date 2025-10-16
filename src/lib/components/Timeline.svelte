<script lang="ts">
	import type { TimelineData } from './types';
	import * as Table from '$lib/components/ui/table/index.js';
	import TimelineItem from './TimelineItem.svelte';

	type Props = {
		timelineData: TimelineData;
	};

	let { timelineData }: Props = $props();

	let minYear = $derived.by(() => Math.min(...timelineData.events.map((e) => e.yearStart)));
	let maxYear = $derived.by(() =>
		Math.max(...timelineData.events.map((e) => e.yearEnd || e.yearStart))
	);
	let years = $derived.by(() => {
		const yrs = [];
		for (let y = minYear; y <= maxYear; y++) {
			yrs.push(y);
		}
		return yrs;
	});

	let categories = $derived.by(() => {
		const cats = [...new Set(timelineData.events.map((e) => e.categoria))];
		if (timelineData.categoriaOrder.length) {
			return timelineData.categoriaOrder
				.filter((c) => cats.includes(c))
				.concat(cats.filter((c) => !timelineData.categoriaOrder.includes(c)));
		}
		return cats;
	});
</script>

<Table.Root>
	<Table.Caption>A list of your recent invoices.</Table.Caption>
	<Table.Header class="sticky top-0 z-20 bg-gray-300">
		<Table.Row>
			<Table.Head class="sticky left-0 z-10 bg-gray-300">Categoría</Table.Head>
			{#each years as year}
				<Table.Head class="w-[100px]">{year}</Table.Head>
			{/each}
		</Table.Row>
	</Table.Header>
	<Table.Body>
		{#each categories as category}
			<Table.Row>
				<Table.Cell class="sticky left-0 z-10 bg-white font-medium">{category}</Table.Cell>
				{#each years as year}
					<Table.Cell class="w-[100px]">
						<TimelineItem {timelineData} {year} {category} />
					</Table.Cell>
				{/each}
			</Table.Row>
		{/each}
	</Table.Body>
</Table.Root>

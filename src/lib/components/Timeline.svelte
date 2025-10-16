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

	// Devuelve el color de la categoría, o un color por defecto si no existe
	function getCategoriaColor(categoria: string) {
		return timelineData.categoriaColors?.[categoria] || '#e0e0e0';
	}

	// Devuelve los eventos de una categoría ordenados por yearStart
	function getEventsByCategory(category: string) {
		return timelineData.events
			.filter((e) => e.categoria === category)
			.sort((a, b) => (a.yearStart ?? 0) - (b.yearStart ?? 0));
	}

	// Genera las celdas para una fila de categoría, cada celda puede tener colspan
	function getCategoryCells(category: string, years: number[]) {
		const events = getEventsByCategory(category);
		const cells = [];
		let yearIdx = 0;
		let eventIdx = 0;
		while (yearIdx < years.length) {
			const year = years[yearIdx];
			const event = events[eventIdx];
			if (event && event.yearStart === year) {
				const span = (event.yearEnd ? event.yearEnd : event.yearStart) - event.yearStart + 1;
				cells.push({ event, colspan: span });
				yearIdx += span;
				eventIdx++;
			} else {
				cells.push({ event: null, colspan: 1 });
				yearIdx++;
			}
		}
		return cells;
	}
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
			<Table.Row style="background-color: {getCategoriaColor(category)}10;">
				<Table.Cell
					class="sticky left-0 z-10 font-medium"
					style="background-color: {getCategoriaColor(category)};">{category}</Table.Cell
				>
				{#each getCategoryCells(category, years) as cell, i}
					<Table.Cell
						colspan={cell.colspan}
						style="background-color: {getCategoriaColor(category)}; border-right: 1px solid #bbb;"
					>
						{#if cell.event}
							<TimelineItem item={cell.event} />
						{/if}
					</Table.Cell>
				{/each}
			</Table.Row>
		{/each}
	</Table.Body>
</Table.Root>

<script lang="ts">
	import type { TimelineData } from './types';

	type Props = {
		timelineData: TimelineData;
		year: number;
		category: string;
	};

	let { timelineData, year, category }: Props = $props();
	let item = $derived.by(() => {
		return timelineData.events.find((i) => i.yearStart === year && i.categoria === category);
	});
</script>

<div class="w-96 text-wrap">
	{item?.text}
</div>

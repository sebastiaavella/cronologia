<script lang="ts">
	import type { TimelineEvent } from './types';

	type Props = {
		item: TimelineEvent | undefined;
	};
	let { item }: Props = $props();
</script>

<div class="w-96 text-wrap">
	<div>{item?.text}</div>

	{#if item?.media}
		<div class="mb-2">
			<img src={item.media} alt="" class="w-full rounded object-cover" />
		</div>
	{/if}
</div>

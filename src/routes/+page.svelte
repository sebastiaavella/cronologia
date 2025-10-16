<script lang="ts">
	import Timeline from '$lib/components/Timeline.svelte';
	import type { TimelineData } from '$lib/components/types';
	import Button from '$lib/components/ui/button/button.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import { onMount } from 'svelte';

	let timelineData = $state<TimelineData>();

	let events = $state([]);
	let categoriaOrder = $state([]);
	let categoriaColors = $state({});
	let editingIndex = $state(null);
	let oldCategoria = $state(null);
	let allMediaVisible = $state(false);
	let largeImages = $state(false);

	onMount(() => {
		loadFromLocal();
	});

	function saveToLocal() {
		localStorage.setItem('cronologiaData', JSON.stringify(timelineData));
	}

	function loadFromLocal() {
		const data = localStorage.getItem('cronologiaData');
		if (data) {
			try {
				const parsed = JSON.parse(data) as TimelineData;
				timelineData = parsed;
			} catch (e) {
				console.error('Error al leer localStorage', e);
			}
		}
	}

	/* === Import/Export === */
	function handleImport(e: any) {
		const f = e.target.files[0];
		if (!f) return;
		const r = new FileReader();
		r.onload = (ev) => {
			try {
				const parsed = JSON.parse(ev.target.result) as TimelineData;
				// TODO: validate parsed data
				if (!Array.isArray(parsed.events)) throw new Error('Invalid events');
				if (!Array.isArray(parsed.categoriaOrder)) throw new Error('Invalid categories');

				timelineData = parsed;
				console.log('data loaded');
				saveToLocal();
			} catch (err) {
				alert('Error leyendo JSON: ' + err);
			}
		};
		r.readAsText(f);
	}

	function exportJSON() {
		const out = { events, categoriaOrder, categoriaColors };
		const blob = new Blob([JSON.stringify(out, null, 2)], { type: 'application/json' });
		const a = document.createElement('a');
		a.href = URL.createObjectURL(blob);
		a.download = 'cronologia.json';
		a.click();
		URL.revokeObjectURL(a.href);
	}

	function saveEvent() {}

	function clearForm() {}
	function deleteEvent() {}
	function toggleAllMedia() {}
	function toggleImageSize() {}
</script>

<div class="flex flex-col items-center justify-center gap-4">
	<h1>Cronología estilo Excel</h1>
	<div class="flex gap-2">
		<Button class="btn" onclick={exportJSON}>📤 Exportar JSON</Button>
		<Button class="btn" onclick={() => document.getElementById('fileInput')?.click()}>
			📥 Importar JSON
		</Button>
	</div>

	<input id="fileInput" type="file" accept=".json" onchange={handleImport} style="display:none" />

	<div class="flex gap-2">
		<Input type="number" id="yearStart" placeholder="Año inicio" style="width:110px" />
		<Input type="number" id="yearEnd" placeholder="Año fin (opcional)" style="width:140px" />

		--

		<Input type="text" id="text" placeholder="Descripción" style="width:300px" />
		<Input type="text" id="media" placeholder="Ruta multimedia (opcional)" style="width:320px" />
		<Button class="btn" onclick={saveEvent}>Guardar evento</Button>
		<Button class="btn" onclick={clearForm}>Limpiar</Button>
		<Button
			class="btn"
			id="deleteBtn"
			style="display:none;background:#c82333;color:#fff"
			onclick={deleteEvent}
		>
			Eliminar
		</Button>
	</div>

	<div class="flex gap-2">
		<Button class="btn" onclick={toggleAllMedia}>🎛 Mostrar/Ocultar multimedia</Button>
		<Button class="btn" onclick={toggleImageSize}>🔍 Cambiar tamaño imágenes</Button>
	</div>
</div>

<div class="relative mt-5 overflow-auto">
	{#if timelineData}
		<Timeline {timelineData} />
	{/if}
</div>

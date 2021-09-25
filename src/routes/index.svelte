<script context="module" lang="ts">
	export const prerender = true;
</script>

<script lang="ts">
	import { Row, Col } from 'svelte-materialify/src/components/Grid';
	import StatsBar from "$lib/kedge/StatsBar.svelte";
	import TasksTable from "$lib/kedge/TasksTable.svelte";
	import { onMount } from 'svelte';
	import syncStore from '$stores/sync';

	let loading = true
	let stateData = {}
	let taskLength = 0

	onMount(async () => {
		syncStore.subscribe(res => {
			stateData = res || {torrents:[]}
			taskLength = stateData.torrents ? Object.keys(stateData.torrents).length : 0
		})
		loading = false
	});

</script>

<svelte:head>
	<title>Kedge</title>
</svelte:head>

<section>
  <Row >
    <Col>
				<StatsBar stats="{stateData.stats}" />
	  </Col>
  </Row>
	<TasksTable tasks={stateData.torrents} />

</section>


<style>
</style>

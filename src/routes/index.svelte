<script context="module" lang="ts">
	export const prerender = true;
</script>

<script lang="ts">
	import Chip from 'svelte-materialify/src/components/Chip/Chip.svelte';
	import Badge from 'svelte-materialify/src/components/Badge/Badge.svelte';
	import { Row, Col } from 'svelte-materialify/src/components/Grid';
	import Icon from 'svelte-materialify/src/components/Icon/Icon.svelte';
	import FaDownload from '$lib/icons/FaDownload.svelte';
	import FaUpload from '$lib/icons/FaUpload.svelte';
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
	})

</script>

<svelte:head>
	<title>Home</title>
</svelte:head>

<section>
  <Row >
    <Col>
				{#if stateData.stats}
				<p class="d-flex">
					<Chip>task count: {stateData.stats.taskCount}</Chip>
					<Chip>uptime: {stateData.stats.uptime}</Chip>
					<Badge class="primary-color" bordered value={stateData.stats.numDownloading || 0} offsetX={16} offsetY={16}>
						<Chip><span class="icon"><FaDownload /></span></Chip>
					</Badge>
					<Badge class="primary-color" bordered value={stateData.stats.numSeeding || 0} offsetX={16} offsetY={16}>
						<Chip><span class="icon"><FaUpload /></span></Chip>
					</Badge>
				</p>
				{:else}
					<p>...loading</p>
				{/if}
				<Icon class="fa fa-camera" />
	  </Col>
  </Row>
	{#if stateData.torrents && stateData.torrents.length}
		<Row>
			<Col>Name</Col>
			<Col cols={12} sm={1} md={1} lg={2}>Size</Col>
			<Col cols={12} sm={1} md={1} lg={1}>Progress</Col>
			<Col cols={12} sm={1} md={1} lg={2}>state</Col>
			<Col cols={12} sm={1} md={1} lg={1}>conn.</Col>
		</Row>
		{#each stateData.torrents as task}
		<Row >
			<Col>{task.name}</Col>
			<Col cols={12} sm={1} md={1} lg={2}>{task.total_wanted}</Col>
			<Col cols={12} sm={1} md={1} lg={1}>{task.progress*100}%</Col>
			<Col cols={12} sm={1} md={1} lg={2}>{task.syncStatus}</Col>
			<Col cols={12} sm={1} md={1} lg={1}>{task.num_connections || 0}</Col>
		</Row>
		{:else}
			<Row><Col>...loading</Col></Row>
		{/each}
	{/if}
	</section>


<style>
  .icon {
    width: 1.2em;
    height: 1.2em;
  }
	.s-chip {
		padding: .1em .8em;
	}
</style>

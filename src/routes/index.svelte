<script context="module" lang="ts">
	export const prerender = true;
</script>

<script lang="ts">
	import Chip from 'svelte-materialify/src/components/Chip/Chip.svelte';
	import { Row, Col } from 'svelte-materialify/src/components/Grid';

	import { callApi } from '$lib/api';
	let sess = getSess();
	let stats = getStats();
	let tasks = getTasks();

	async function getSess() {
		return await callApi('/api/sess');
	}

	async function getStats() {
		return await callApi('/api/stats');
	}

	async function getTasks() {
		return await callApi('/api/torrents');
	}

</script>

<svelte:head>
	<title>Home</title>
</svelte:head>

<section>
  <Row >
    <Col>
				{#await stats}
					<p>...loading</p>
				{:then stats}
				<p class="d-flex">
					<Chip>task count: {stats.taskCount}</Chip>
					<Chip>uptime: {stats.uptime}</Chip>
				</p>
				{:catch error}
					<p style="color: red">{error.message}</p>
				{/await}
	  </Col>
  </Row>
	{#await tasks}
	<Row><Col>...loading</Col></Row>
	{:then tasks}
		{#each tasks as task}
		<Row >
			<Col>{task.name}</Col>
			<Col cols={12} sm={1} md={1} lg={2}>{task.total_wanted}</Col>
			<Col cols={12} sm={1} md={1} lg={1}>{task.progress*100}%</Col>
			<Col cols={12} sm={1} md={1} lg={1}>{task.state}</Col>
		</Row>
		{/each}
	{/await}
	</section>


<style>

</style>

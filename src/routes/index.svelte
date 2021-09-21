<script context="module" lang="ts">
	export const prerender = true;
</script>

<script lang="ts">
	import Chip from 'svelte-materialify/src/components/Chip/Chip.svelte';
	import Badge from 'svelte-materialify/src/components/Badge/Badge.svelte';
	import Dialog from 'svelte-materialify/src/components/Dialog/Dialog.svelte';
	import Checkbox from 'svelte-materialify/src/components/Checkbox/Checkbox.svelte';
	import { default as Card, CardTitle, CardText, CardActions } from 'svelte-materialify/src/components/Card';
	import { Row, Col } from 'svelte-materialify/src/components/Grid';
	import Button from 'svelte-materialify/src/components/Button/Button.svelte';
	import Icon from 'svelte-materialify/src/components/Icon/Icon.svelte';
	import iconDelete from '$lib/icons/delete';
	import FaDownload from '$lib/icons/FaDownload.svelte';
	import FaUpload from '$lib/icons/FaUpload.svelte';
	import { onMount } from 'svelte';
	import syncStore from '$stores/sync';
	import * as api from '$lib/api';

	let loading = true
	let stateData = {}
	let taskLength = 0
	let isDeletingDialog = false
	let currTask = {}
	let deleteWithData = false;

	onMount(async () => {
		syncStore.subscribe(res => {
			stateData = res || {torrents:[]}
			taskLength = stateData.torrents ? Object.keys(stateData.torrents).length : 0
		})
		loading = false
	});

	function showDeleteDialog(task:any): void {
		isDeletingDialog = true
		currTask = task
		deleteWithData = false
	}
	function closeDeleteDialog(): void {
		isDeletingDialog = false
	}
	function callDeleteTorrent(task: any) : void {
		api.deleteTorrent(currTask.info_hash, deleteWithData).then((res) => {
			console.log(res.status)
		})
		closeDeleteDialog()
	}

</script>

<svelte:head>
	<title>Home</title>
</svelte:head>

<Dialog bind:active={isDeletingDialog}>
	<Card>
    <CardTitle>Are you sure you want to delete this task?</CardTitle>
    <CardText>
			<Checkbox color="red" checked={deleteWithData}> with data files.</Checkbox>
      Please note that this operation is not recoverable.
    </CardText>
    <CardActions>
      <Button on:click={closeDeleteDialog} text>Cancel</Button>
      <Button on:click={callDeleteTorrent(currTask)} text class="red-text">Yes. delete it!</Button>
    </CardActions>
  </Card>
</Dialog>

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
			<Col cols={12} sm={1} md={1} lg={1}>act.</Col>
		</Row>
		{#each stateData.torrents as task}
		<Row >
			<Col>{task.name}</Col>
			<Col cols={12} sm={1} md={1} lg={2}>{task.prettyTotal}</Col>
			<Col cols={12} sm={1} md={1} lg={1}>{task.progress*100}%</Col>
			<Col cols={12} sm={1} md={1} lg={2}>{task.syncStatus}</Col>
			<Col cols={12} sm={1} md={1} lg={1}>{task.num_connections || 0}</Col>
			<Col cols={12} sm={1} md={1} lg={1}>
				<Button icon on:click={showDeleteDialog(task)}>
					<Icon path={iconDelete} />
				</Button>
			</Col>
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

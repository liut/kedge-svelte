<script lang="ts">
  import Dialog from 'svelte-materialify/src/components/Dialog/Dialog.svelte';
  import Checkbox from 'svelte-materialify/src/components/Checkbox/Checkbox.svelte';
  import { default as Card, CardTitle, CardText, CardActions } from 'svelte-materialify/src/components/Card';
  import { Row, Col } from 'svelte-materialify/src/components/Grid';
  import Button from 'svelte-materialify/src/components/Button/Button.svelte';
  import Icon from 'svelte-materialify/src/components/Icon/Icon.svelte';
  import iconDelete from '$lib/icons/delete';
  import iconFileTable from '$lib/icons/file-table';
  import * as api from '$lib/api';
  import utils from '$lib/util';
  import { onMount } from 'svelte';

  export let tasks = []

  onMount(async () => {api.getTasks().then((res) => {
    tasks = res;
  })});

	let isDeletingDialog = false
	let isTaskFilesDialog = false
	let isTaskPeersDialog = false
	let currTask = {}
	let deleteWithData = false;
	let loadFiles = async () => {
		if (!currTask || !currTask.info_hash) return []
		const res = await api.getTaskFiles(currTask.info_hash)
		return res
	}
	let files;
	let loadPeers = async () => {
		if (!currTask || !currTask.info_hash) return []
		const res = await api.getTaskPeers(currTask.info_hash)
		return res
	}
	let peers;

	function showDeleteDialog(task:any): void {
		isDeletingDialog = true
		currTask = task
		deleteWithData = false
	}
	function closeDeleteDialog(): void {
		isDeletingDialog = false
	}
	function callDeleteTask() : void {
		api.deleteTask(currTask.info_hash, deleteWithData).then((res) => {
			console.log(res.status)
		})
		closeDeleteDialog()
	}

	function showFilesDialog(task:any): void {
		currTask = task
		isTaskFilesDialog = true
		files = loadFiles()
	}

	function showPeersDialog(task:any): void {
		currTask = task
		isTaskPeersDialog = true
		peers = loadPeers()
	}

</script>

{#if tasks && tasks.length}

<Row>
	<Col>Name</Col>
	<Col cols={12} sm={1} md={1} lg={2} class="text-center">Size</Col>
	<Col cols={12} sm={1} md={1} lg={1}>Progress</Col>
	<Col cols={12} sm={1} md={1} lg={2} class="text-center">State</Col>
	<Col cols={12} sm={1} md={1} lg={1}>conn.</Col>
	<Col cols={12} sm={1} md={1} lg={1}>act.</Col>
</Row>
{#each tasks as task}
<Row >
	<Col>{task.name || task.info_hash}
		{#if task.total_wanted > 0}
		<Button icon size="small" on:click={e => showFilesDialog(task)}>
			<Icon path="{iconFileTable}" size="16px" />
		</Button>
		{/if}
	</Col>
	<Col cols={12} sm={1} md={1} lg={2} class="text-right">
		{utils.formatBytes(task.total_done||0)}/{utils.formatBytes(task.total_wanted||0)}</Col>
	<Col cols={12} sm={1} md={1} lg={1} class="text-right">{utils.formatPecent(task.progress_ppm/10000)}%</Col>
	<Col cols={12} sm={1} md={1} lg={2} class="text-center">{utils.formatStatus(task.state)}
		{utils.formatBytes(task.download_rate || 0)}/s
		{utils.formatBytes(task.upload_rate || 0)}/s</Col>
	<Col cols={12} sm={1} md={1} lg={1} class="text-center">{#if task.num_connections}
		 <Button text on:click={e => showPeersDialog(task)}>{task.num_peers || 0} ({task.num_connections || 0})</Button>
	{:else}
		 <!-- else content here -->
	{/if}
	</Col>
	<Col cols={12} sm={1} md={1} lg={1}>
		<Button icon on:click={e => showDeleteDialog(task)}>
			<Icon path={iconDelete} />
		</Button>
	</Col>
</Row>
{:else}
	<Row><Col>...loading</Col></Row>
{/each}

{/if}

<Dialog bind:active={isDeletingDialog}>
	<Card>
    <CardTitle>Are you sure you want to delete this task?</CardTitle>
    <CardText>
			<Checkbox color="red" bind:checked={deleteWithData}> with data files.</Checkbox>
      Please note that this operation is not recoverable.
    </CardText>
    <CardActions>
      <Button on:click={closeDeleteDialog} text>Cancel</Button>
      <Button on:click={e => callDeleteTask()} text class="red-text">Yes. delete it!</Button>
    </CardActions>
  </Card>
</Dialog>

<Dialog class="pa-2" bind:active={isTaskFilesDialog}>
	<p class="text--secondary">{currTask.save_path}/{currTask.name}, files:</p>
	{#await files}
	<p>...waiting</p>
	{:then files}
		{#each files as file}
			 <p class="text--secondary">{file.name} {utils.formatBytes(file.size)} {utils.formatPecent(file.progress/10)}%</p>
		{/each}
	{:catch error}
		<p style="color: red">{error.message}</p>
	{/await}
</Dialog>

<Dialog class="pa-2" width="620" bind:active={isTaskPeersDialog}>
	{#await peers}
	<p>...waiting</p>
	{:then peers}
	{#each peers as peer}
		<Row class="text--secondary" dense>
		 <Col>{peer.ip}:{peer.port}</Col>
		 <Col>{peer.client}</Col>
		 <Col>{utils.formatPecent(peer.progress/10000, 0)}%</Col>
		 <Col>d{utils.formatBytes(peer.down_speed)} u{utils.formatBytes(peer.up_speed)}</Col>
		</Row>
	{/each}
	{:catch error}
		<p style="color: red">{error.message}</p>
	{/await}
</Dialog>

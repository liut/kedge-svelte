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

	let isDeletingDialog = false
	let isTaskFilesDialog = false
	let currTask = {}
	let deleteWithData = false;

  export let tasks = []

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
	<Col>{task.name}
		<Button icon size="small" on:click={e => showFilesDialog(task)}>
			<Icon path="{iconFileTable}" size="16px" />
		</Button>
	</Col>
	<Col cols={12} sm={1} md={1} lg={2} class="text-right">{task.prettyCompleted||0}/{task.prettyTotal}</Col>
	<Col cols={12} sm={1} md={1} lg={1} class="text-right">{utils.formatPecent(task.progress_ppm/10000)}%</Col>
	<Col cols={12} sm={1} md={1} lg={2} class="text-center">{task.syncStatus}</Col>
	<Col cols={12} sm={1} md={1} lg={1} class="text-center">{task.num_connections || 0}</Col>
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

<Dialog bind:active={isTaskFilesDialog}>
	
</Dialog>

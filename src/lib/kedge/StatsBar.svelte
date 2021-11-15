<script lang="ts">
  import { Row, Col } from 'svelte-materialify/src/components/Grid';
  import Chip from 'svelte-materialify/src/components/Chip/Chip.svelte';
  import Badge from 'svelte-materialify/src/components/Badge/Badge.svelte';
  import Button from 'svelte-materialify/src/components/Button/Button.svelte';
  import Dialog from 'svelte-materialify/src/components/Dialog/Dialog.svelte';
  import Icon from 'svelte-materialify/src/components/Icon/Icon.svelte';
  import TextField from 'svelte-materialify/src/components/TextField/TextField.svelte';
  import iconFileUpload from '$lib/icons/file-upload';
  import iconLink from '$lib/icons/link';
  import FaDownload from '$lib/icons/FaDownload.svelte';
  import FaUpload from '$lib/icons/FaUpload.svelte';
  import * as api from '$lib/api';
  import utils from '$lib/util';
  import { onMount } from 'svelte';

  export let stats = {};

  onMount(async () => {api.getSessionStats().then((res) => {
    stats = res;
  })});

  let fileInput;
  let savePath = '';
  let magnetlink = '';
  let isAddingDialog = false;

  const showAddingDialog = (e: Event) => {
    isAddingDialog = true
  }

	const onFileSelected =(e: Event)=>{
    const file = e.target.files[0];
    api.uploadTorrent(file, {savePath}).then(res => {
      console.log(res)
      isAddingDialog = false
      fileInput.value = ''
    }).catch(err => {
      console.log(err)
    })
  }

  const onMagnetLinkClick = (e: Event) => {
    api.uploadMagnet(magnetlink, {savePath}).then(res => {
      console.log(res)
      isAddingDialog = false
      magnetlink = '';
    }).catch(err => {
      console.log(err)
    })
  }


</script>

<Row >
  <Col>

{#if stats}
  <Badge class="primary-color" bordered value={stats.numDownloading || 0} offsetX={16} offsetY={16}>
    <Chip class="ma-1"><span class="icon"><FaDownload /></span></Chip>
  </Badge>

  <Badge class="primary-color" bordered value={stats.numSeeding || 0} offsetX={16} offsetY={16}>
    <Chip class="ma-1"><span class="icon"><FaUpload /></span></Chip>
  </Badge>

  <Chip class="ma-2">I:
    {#if stats.hasIncoming}
     +
    {:else}
     -
  {/if}</Chip>
  <Chip class="ma-1"><span title="num peers connected">PC: {stats.numPeersConnected || 0}</span></Chip>
  <Chip class="ma-1"><span title="num peers half open">PHO: {stats.numPeersHalfOpen || 0}</span></Chip>
  <Chip class="ma-1"><span title="queued bytes">Q: {utils.formatBytes(stats.bytesQueued || 0)}</span></Chip>
  <Chip class="ma-1"><span title="wasted bytes">W: {utils.formatBytes(stats.bytesWasted || 0)}</span></Chip>
  <Chip class="ma-1"><span title="download rate">R: {utils.formatBytes(stats.rateRecv || 0)}/s</span></Chip>
  <Chip class="ma-1"><span title="upload rate">S: {utils.formatBytes(stats.rateSent || 0)}/s</span></Chip>

{:else}
  loading...
{/if}
  </Col>
  <Col cols={12} sm={1} md={1} lg={1}>
    <Button icon on:click={showAddingDialog}>
			<Icon path={iconFileUpload} />
		</Button>

  </Col>
</Row>

<Dialog class="pa-4 text-center" bind:active={isAddingDialog}>
  <TextField outlined bind:value={savePath}>
    save path(optional)
  </TextField>

  <TextField outlined bind:value={magnetlink}>
    <div slot="prepend">
      <Icon path={iconLink} />
    </div>
    magnet link
  </TextField>
  <Button depressed on:click={onMagnetLinkClick}>Add magnet</Button>


  <Button outlined on:click={() => {fileInput.click();}}>
    or add a file
  </Button>
  <input style="display:none" type="file" accept=".torrent" on:change={(e)=>onFileSelected(e)} bind:this={fileInput} >

</Dialog>


<style>
  .icon {
    width: 1.2em;
    height: 1.2em;
  }
</style>

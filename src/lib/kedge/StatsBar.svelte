<script lang="ts">
	import Chip from 'svelte-materialify/src/components/Chip/Chip.svelte';
	import Badge from 'svelte-materialify/src/components/Badge/Badge.svelte';
	// import Button from 'svelte-materialify/src/components/Button/Button.svelte';
	import FaDownload from '$lib/icons/FaDownload.svelte';
	import FaUpload from '$lib/icons/FaUpload.svelte';
  import utils from '$lib/util';

  export let stats = {};
</script>

<p class="d-flex">
{#if stats}
  <Chip>task count: {stats.taskCount || 0}</Chip>
  <Chip><span title="num peers connected">PC: {stats.numPeersConnected || 0}</span></Chip>
  <Chip><span title="num peers half open">PHO: {stats.numPeersHalfOpen || 0}</span></Chip>
  <Chip><span title="download rate">R: {utils.formatBytes(stats.rateRecv || 0)}</span></Chip>
  <Chip><span title="upload rate">S: {utils.formatBytes(stats.rateSent || 0)}</span></Chip>

  <Badge class="primary-color" bordered value={stats.numDownloading || 0} offsetX={16} offsetY={16}>
    <Chip><span class="icon"><FaDownload /></span></Chip>
  </Badge>

  <Badge class="primary-color" bordered value={stats.numSeeding || 0} offsetX={16} offsetY={16}>
    <Chip><span class="icon"><FaUpload /></span></Chip>
  </Badge>

{:else}
  loading...
{/if}
</p>

<style>
  .icon {
    width: 1.2em;
    height: 1.2em;
  }
</style>

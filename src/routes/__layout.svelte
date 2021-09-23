<script lang="ts">
	import MaterialApp from 'svelte-materialify/src/components/MaterialApp/MaterialApp.svelte';
	import Footer from 'svelte-materialify/src/components/Footer/Footer.svelte';
	import Header from '$lib/header/Header.svelte';
	import '../app.css';

	import { theme } from '$stores/theme';
	import { onMount } from 'svelte';
	import syncStore from '$stores/sync';
  import utils from '$lib/util';

	let uptime = 0

	onMount(async () => {
		syncStore.v();
		syncStore.subscribe(res => {
			if(res.stats && res.stats.uptime) uptime = res.stats.uptime || 0
		})
	});
</script>

<MaterialApp theme="{$theme}">
<Header />

<main>
	<slot />
</main>

<Footer fixed padless class=" justify-center flex-column">
  <div class=" pa-2 text-center">
    2021 -
    <b>kedge by liut, uptime: {utils.formatSeconds(uptime)}</b>
  </div>
</Footer>

</MaterialApp>

<style>
	main {
		flex: 1;
		display: flex;
		flex-direction: column;
		padding: 1rem;
		width: 100%;
		max-width: 1024px;
		margin: 0 auto;
		box-sizing: border-box;
	}

</style>

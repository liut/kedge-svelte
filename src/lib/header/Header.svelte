<script lang="ts">
	// import { page } from '$app/stores';
	import { onMount } from 'svelte';

	import Button from 'svelte-materialify/src/components/Button/Button.svelte';
	import Icon from 'svelte-materialify/src/components/Icon/Icon.svelte';
	import invertColors from '$lib/icons/invert-colors';

	import { theme } from '$stores/theme';


	let legacy = true;

	onMount(async () => {
		try {
			legacy = !(window.CSS && window.CSS.supports && window.CSS.supports('(--foo: red)'));

			let mql = window.matchMedia('(prefers-color-scheme: dark)');
			mql.matches && setTheme('dark');
		} catch (err) {} // eslint-disable-line
	});

	function setTheme(name) {
		name = name.replace(/\s/g, '').toLowerCase();

		$theme = name;
		// $theme === 'dark'
		// 	? Object.keys(darkTheme).map((key) => {
		// 			document.documentElement.style.setProperty(key, darkTheme[key]);
		// 	  })
		// 	: document.documentElement.removeAttribute('style');
	}
</script>

<header>
	<div class="corner">
		<!-- <a href="https://kit.svelte.dev">
			<img src={logo} alt="SvelteKit" />
		</a> -->
	</div>

	<nav>
		header
		<!-- <svg viewBox="0 0 2 3" aria-hidden="true">
			<path d="M0,0 L1,2 C1.5,3 1.5,3 2,3 L2,0 Z" />
		</svg>
		<ul>
			<li class:active={$page.path === '/'}><a sveltekit:prefetch href="/">Home</a></li>
			<li class:active={$page.path === '/about'}><a sveltekit:prefetch href="/about">About</a></li>
			<li class:active={$page.path === '/todos'}><a sveltekit:prefetch href="/todos">Todos</a></li>
		</ul>
		<svg viewBox="0 0 2 3" aria-hidden="true">
			<path d="M0,0 L0,3 C0.5,3 0.5,3 1,2 L2,0 Z" />
		</svg> -->
	</nav>

	<div class="corner">
		{#if !legacy}
			<Button icon on:click={() => setTheme($theme === 'dark' ? 'light' : 'dark')}>
				<Icon path={invertColors} />
			</Button>
		{/if}
	</div>
</header>

<style>
	header {
		display: flex;
		justify-content: space-between;
	}

	.corner {
		width: 3em;
		height: 3em;
	}

	/* .corner a {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		height: 100%;
	} */

	/* .corner img {
		width: 2em;
		height: 2em;
		object-fit: contain;
	} */

	nav {
		display: flex;
		justify-content: center;
		--background: rgba(255, 255, 255, 0.7);
	}

	/* svg {
		width: 2em;
		height: 3em;
		display: block;
	} */

	/* path {
		fill: var(--background);
	} */

	/* ul {
		position: relative;
		padding: 0;
		margin: 0;
		height: 3em;
		display: flex;
		justify-content: center;
		align-items: center;
		list-style: none;
		background: var(--background);
		background-size: contain;
	}

	li {
		position: relative;
		height: 100%;
	}

	li.active::before {
		--size: 6px;
		content: '';
		width: 0;
		height: 0;
		position: absolute;
		top: 0;
		left: calc(50% - var(--size));
		border: var(--size) solid transparent;
		border-top: var(--size) solid var(--accent-color);
	} */

	/* nav a {
		display: flex;
		height: 100%;
		align-items: center;
		padding: 0 1em;
		color: var(--heading-color);
		font-weight: 700;
		font-size: 0.8rem;
		text-transform: uppercase;
		letter-spacing: 10%;
		text-decoration: none;
		transition: color 0.2s linear;
	}

	a:hover {
		color: var(--accent-color);
	} */
</style>

<h1>Welcome to SvelteKit kaas</h1>
<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>

<script>
	import TestBarchart from '../components/test.svelte';
    import MyDataChart from '../components/testBarchart.svelte';
</script>

<TestBarchart/>
<MyDataChart/>

<svelte:head>
	<title>Barchart test</title>
	<link rel="icon" href="/images/favicon.png" type="image/png" />
	<link rel="stylesheet" href="generalstyle.scss" />
</svelte:head>
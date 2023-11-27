<script>
	import StarterForm from '../components/starterForm.svelte';
	import ScrollButton from '../components/elements/scrollDownButton.svelte';
	import Bubbleplot from '../components/bubbleplot.svelte';
	import Testbarchart from '../components/testBarchart.svelte';
</script>

<section class="spacer">
	<h1>Disney World Incident Matcher</h1>
	<p>
		Hey there, adventurers! Brace yourselves for the Disney scoop beyond the usual fun! Discover the
		thrilling incident waiting just for you! We've checked out all the exciting happenings at Disney
		World/Universal Studios Orlando (Florida) from 2002 to 2022 to find your perfect match! So, will
		you break your leg, or get dizzy? You will find out soon!
	</p>

	<section>
		<StarterForm />
	</section>

	<div class="viewportscroll">
		<ScrollButton />
	</div>
</section>

<section id="bubbleplot" class="spacer">
	<section>
		<Bubbleplot />
	</section>
</section>

<svelte:head>
	<title>Disney Incident Matcher</title>
	<link rel="icon" href="/img/mickeyfavicon.png" type="image/png" />
	<link rel="stylesheet" href="generalstyle.scss" />
</svelte:head>

<style lang="scss">

	#bubbleplot {
		padding-top: 2rem;
	}
	section:nth-of-type(1) {
		display: flex;
		flex-direction: column;
		align-items: center;

		> section {
			text-align: center;
		}
	}

	.viewportscroll {
		margin:5%;
	}

	/* Add spacing to push Bubbleplot section to the second viewport */
	.spacer {
		min-height: 100vh; /* Adjust height as needed */
	}
</style>

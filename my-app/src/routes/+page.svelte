<script>
	import StarterForm from '../components/starterForm.svelte';
	import ScrollButton from '../components/elements/scrollDownButton.svelte';
	import Treemap from '../components/treemap.svelte';
	import Specials from '../components/specials.svelte';

	import Footer from '../components/partials/footer.svelte';
</script>

<svelte:head>
	<title>Disney Incident Matcher</title>
	<link rel="icon" href="/img/mickeyfavicon.png" type="image/png" />
	<link rel="stylesheet" href="/generalstyle.css">
</svelte:head>

<!-- Your page content goes here -->
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

<section id="treemap" class="spacer">
	<section>
		<Treemap />
	</section>
</section>

<section>
	<Specials/>
</section>

<Footer/>

<style lang="scss">
	#treemap {
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
		margin: 5%;
	}

	.spacer {
		min-height: 100vh; /* Adjust height as needed */
	}
</style>

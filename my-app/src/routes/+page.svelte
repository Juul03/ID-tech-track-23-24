<script>
	import StarterForm from '../components/starterForm.svelte';
	import ScrollButton from '../components/elements/scrollDownButton.svelte';
</script>

<section>
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
	
	<ScrollButton />
</section>


<svelte:head>
	<title>Barchart test</title>
	<link rel="icon" href="/images/favicon.png" type="image/png" />
	<link rel="stylesheet" href="generalstyle.scss" />
</svelte:head>

<style lang="scss">

  section:nth-of-type(1) {
    display: flex;
    flex-direction: column;
    align-items: center;

	> section {
    margin-top: 20px; /* Adjust margin as needed */
    text-align: center;
  }
  }



</style>

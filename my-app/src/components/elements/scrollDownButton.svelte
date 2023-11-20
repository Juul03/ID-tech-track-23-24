<script>
	let scrollToNext = (scrollEvent) => {
		scrollEvent.preventDefault();
		window.scrollBy({
			top: window.innerHeight,
			behavior: 'smooth'
		});
	};
</script>

<a href="#" on:click|preventDefault={scrollToNext} role="button" aria-label="Scroll down">
	Explore more
	<span>↓</span>
</a>

<style lang="scss">
	a {
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
		text-decoration: none;

		position: fixed;
		bottom: 5%;
		left: 0;
		width: 100%;

        color: var(--secundary-color);

        transition:var(--standard-transition-time);

        &:hover {
            color: var(--accent-color);
        }
	}
</style>

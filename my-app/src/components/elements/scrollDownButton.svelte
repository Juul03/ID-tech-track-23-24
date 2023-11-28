<script>
    import { onMount } from 'svelte';

	let scrollToNext = (scrollEvent) => {
		scrollEvent.preventDefault();
		window.scrollBy({
			top: window.innerHeight,
			behavior: 'smooth'
		});
	};

	// Function to show the link after 5 seconds
	onMount(() => {
		setTimeout(() => {
			const exploreLink = document.querySelector('a');
			if (exploreLink) {
				exploreLink.style.opacity = '1';
			}
		}, 5000);
	});
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
		width: 100%;
        max-width:6rem;

		color: var(--secundary-color);

        opacity: 0;
        transition: opacity var(--standard-transition-time), transform var(--standard-transition-time);

        &:hover {
        opacity: 1;
        color: var(--accent-color);
        transform: translateY(-10%) scale(1.05);
    }
	}

	@media screen and (max-width: 500px) {
		a {
			display:none;
		}
	}
</style>

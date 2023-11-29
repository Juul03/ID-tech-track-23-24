<script>
	import { onMount } from 'svelte';

	let incidentData = [];
	let laborCount = 0;
	let deathCount = 0;

	const countOccurrences = () => {
		const laborIncidents = incidentData.filter((incident) =>
			incident.description_short.includes('labor')
		);
		laborCount = laborIncidents.length;

		const deathIncidents = incidentData.filter(
			(incident) =>
				incident.description.includes('died') || incident.description.includes('passed away')
		);
		deathCount = deathIncidents.length;

		// Start the intersection observer
		const options = {
			root: null,
			rootMargin: '0px',
			threshold: 0.5
		};

		const observer = new IntersectionObserver((entries, observer) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					startCounter(entry.target);
					observer.unobserve(entry.target);
				}
			});
		}, options);

		// Observe elements with a specific class
		const elementsToObserve = document.querySelectorAll('.counter');
		elementsToObserve.forEach((element) => {
			observer.observe(element);
		});
	};

	const startCounter = (targetElement) => {
		const target = +targetElement.dataset.target;
		let currentCount = 0;
		const interval = setInterval(() => {
			if (currentCount < target) {
				currentCount++;
				targetElement.textContent = currentCount;
			} else {
				clearInterval(interval);
			}
		}, 100);
	};

	const fetchJSONData = async () => {
		try {
			const response = await fetch('/data/output.json');
			if (response.ok) {
				incidentData = await response.json();
				countOccurrences();
			} else {
				console.error('Failed to fetch the data');
			}
		} catch (error) {
			console.error('Error fetching data:', error);
		}
	};

	onMount(async () => {
		await fetchJSONData();
	});
</script>

<h2>Numbers that count</h2>

<section>
    <div>
        <p>Labors<span class="counter" data-target={laborCount}>0</span></p>
        <p>Deaths<span class="counter" data-target={deathCount}>0</span></p>
    </div>
</section>

<style lang="scss">
    section {
        background: var(--primary-color-light);
        display:flex;
        flex-direction:column;
        margin-top:1rem;

        div {
        margin:auto;
		display: flex;
        width:500px;
	}
    }
	p {
		display: flex;
		flex-direction: column;
        width: 50%;
        text-align: center;
		font-size: 2rem;
        font-family: 'Waltograph', Verdana, Geneva, Tahoma, sans-serif;
		color: var(--secundary-color);
		span {
            font-family: 'Waltograph', Verdana, Geneva, Tahoma, sans-serif;
            font-size: 3rem;
			color: var(--accent-color);
		}
	}
</style>

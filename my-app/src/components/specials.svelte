<script>
    import { onMount } from 'svelte';

	let incidentData = [];

	// Fetch the JSON data
	const fetchJSONData = async () => {
		try {
			const response = await fetch('/data/output.json');
			if (response.ok) {
				incidentData = await response.json();
                // Count occurrences of "labor" in description_short
				const laborIncidents = incidentData.filter((incident) =>
					incident.description_short.toLowerCase().includes('labor')
				);
				const numberOfLaborIncidents = laborIncidents.length;
				console.log(`Number of labor incidents: ${numberOfLaborIncidents}`);
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

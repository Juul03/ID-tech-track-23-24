<script>
	import { onMount } from 'svelte';
	import { formData } from '$lib/formDataStore';
	import noUiSlider from 'nouislider';
	// import { d3, select, scaleBand, scaleLinear, axisBottom, axisLeft } from 'd3';
	import * as d3 from 'd3';

	let incidentData = [];
	let allIncidentsOccurences = {};

	let filteredIncidentData = [];
	let incidentTypeCounts = {};

	let slider;

	let minAge = 0;
	let maxAge = 100;
	let ageInterval = [minAge, maxAge];
	let userSelectedAgeInterval = [minAge, maxAge];

	const initSlider = () => {
		const sliderContainer = document.getElementById('slider');

		slider = noUiSlider.create(sliderContainer, {
			start: ageInterval,
			connect: true,
			range: {
				min: minAge,
				max: maxAge
			},
			tooltips: [
				{
					to: (value) => parseInt(value, 10), // Format the displayed value
					from: (value) => parseInt(value, 10) // Format the value when set
				},
				{
					to: (value) => parseInt(value, 10), // Format the displayed value
					from: (value) => parseInt(value, 10) // Format the value when set
				}
			]
		});

		// Event listener for when the slider values change
		sliderContainer.noUiSlider.on('update', (values) => {
			ageInterval = values.map((value) => parseInt(value, 10));
			console.log('fullslider' + ageInterval);
		});
	};

	// Function to log formData whenever it changes
	// TODO: use later to update the slider + chart on input change
	const logFormDataOnChange = () => {
		// Subscribe to changes in the formData store
		formData.subscribe((value) => {
			console.log('formData changed:', value);

			const newAge = parseInt(value.age);
			if (!isNaN(newAge)) {
				const newInterval = [newAge - 5, newAge + 5];

				// Update the values of the slider
				if (slider) {
					slider.set(newInterval); // Set the new values for the slider
					ageInterval = newInterval; // Update the ageInterval variable
				}
			}

			filterDataByAgeInterval();
		});
	};

	const filterDataByAgeInterval = () => {
		filteredIncidentData = incidentData.filter((incident) => {
			const incidentAge = parseInt(incident.age);
			return incidentAge >= ageInterval[0] && incidentAge <= ageInterval[1];
		});

		return filteredIncidentData;
	};

	// Function to find the maximum age from incidentData
	const findMaxAge = () => {
		const ages = incidentData.map((incident) => {
			const age = parseInt(incident.age);
			return isNaN(age) ? 0 : age; // Replace NaN with 0 for invalid age entries
		});

		// Filter out 0 (NaN values replaced with 0)
		const validAges = ages.filter((age) => age !== 0);

		if (validAges.length > 0) {
			maxAge = Math.max(...validAges); // Update maxAge with the calculated value
			console.log('Maximum age:', maxAge);
			ageInterval[1] = maxAge;
		} else {
			console.error('No valid ages found in the dataset');
			maxAge = 100; // Set default
			ageInterval[1] = 100;
		}
	};

	// Fetch the JSON data
	const fetchJSONData = async () => {
		const response = await fetch('src/data/output.json');
		if (response.ok) {
			incidentData = await response.json();
			allIncidentsOccurences = countIncidentTypeOccurrences(incidentData);
			findMaxAge();
			createChart();
		} else {
			console.error('Failed to fetch the data');
		}
	};

	let styleSlider = () => {
		const handles = document.querySelectorAll('.noUi-handle');
		const sliderInterval = document.querySelectorAll('.noUi-connect');

		handles.forEach((handle) => {
			handle.style.backgroundColor = 'var(--primary-color-light';
			handle.style.border = '2px solid var(--primary-color';
			handle.style.borderRadius = '50%';
			handle.style.width = '2rem';
			handle.style.height = '2rem';
		});

		sliderInterval.forEach((slider) => {
			slider.style.backgroundColor = 'var(--accent-color)';
		});
	};

	onMount(async () => {
		logFormDataOnChange();
		await fetchJSONData();
		// Maak de slider met de data range uit de dataset
		initSlider();
		styleSlider();
	});

	// Count the amount of times 1 incident occures
	const countIncidentTypeOccurrences = (incidents) => {
		const incidentTypeCounts = {};
		incidents.forEach((incident) => {
			const incidentTypes = incident.description_short;
			incidentTypeCounts[incidentTypes] = (incidentTypeCounts[incidentTypes] || 0) + 1;
		});
		return incidentTypeCounts;
	};

	const createChart = (filteredData) => {
		// TODO: update screenwidth on change
		const screenWidth =
			window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;

		// svg geeft het formaat weer van de grafiek inclusief assen, de visualisationwidth is kleiner zodat er in de svg ruimte is om deze te laten zien
		const svgWidth = screenWidth * 0.9;
		const svgHeight = 500;
		const visualisationWidth = svgWidth * 0.8;
		const visualisationHeight = svgWidth * 0.8;

		const padding = { top: 20, right: 20, bottom: 10, left: 20 };

		// This is normally zero, but could be non-zero if this cell is
		// re-evaluated after the animation plays.
		const initialIndex = 0;

		// Count the maximum of each incident occures
		// Extract the values (incident counts) from the incidentData object
		const incidentCounts = Object.values(allIncidentsOccurences);
		// Find the maximum incident count
		const maxTotalIncidents = Math.max(...incidentCounts);
		console.log('MAXINCIDENT', maxTotalIncidents);

		// Define a color scale using d3.scaleOrdinal()
		const colorForIncidents = d3
			.scaleOrdinal()
			.domain(incidentCounts) // Set the domain to incident types
			.range(d3.schemeCategory10); // Set the range of colors

		// Example: Get color for an incident type
		// TODO: Remove example when everything works
		const incidentType = 'felt ill';
		const incidentColor = colorForIncidents(incidentType);

		console.log(incidentColor); // Check if incidentColor has the color for "injury"

		// Construct the treemap layout.
		const treemap = d3
			.treemap()
			.size([visualisationWidth, visualisationHeight])
			.tile(d3.treemapResquarify) // to preserve orientation when animating
			.padding((d) => (d.height === 1 ? 1 : 0)) // only pad parents of leaves
			.round(true);

		// Transform the incident data into a format suitable for the treemap layout
		const incidentEntries = Object.entries(allIncidentsOccurences).map(([key, value]) => ({
			incidentType: key,
			value: value
		}));

		const svg = d3
			.select('svg')
			.attr('width', svgWidth)
			.attr('height', svgHeight)
			.attr(
				'viewBox',
				`0, 20, ${visualisationWidth}, ${visualisationHeight}`
			)
			.attr('style', 'max-width: 100%; height: auto; font: 10px sans-serif; overflow: visible;');

		const g = svg.append('g').attr('transform', `translate(${padding.left}, ${padding.top})`);

        		// Create the hierarchy structure using the transformed incident data
		const root = d3
			.hierarchy({ children: incidentEntries })
			.sum((d) => d.value)
			.sort((a, b) => b.value - a.value);

		// Construct the treemap layout
		const treemapLayout = d3
			.treemap()
			.size([visualisationWidth, visualisationHeight])
			.padding(1) // Adjust padding as needed
			.round(true);

		// Generate the treemap layout based on the root hierarchy
		treemapLayout(root);

		const leaf = g
			.selectAll('g')
			.data(root.leaves())
			.join('g')
			.attr('transform', (d) => `translate(${d.x0},${d.y0})`);

		leaf
			.append('rect')
			.attr('fill', colorForIncidents)
			.attr('stroke', 'var(--primary-color)')
			.attr('width', (d) => d.x1 - d.x0)
			.attr('height', (d) => d.y1 - d.y0)
			.attr('rx', 5)
			.attr('ry', 5);

		leaf
			.append('text')
			.attr('x', 3)
			.attr('y', 13)
			.text((d) => d.data.incidentType);

		// Additional text for values if needed
		leaf
			.append('text')
			.attr('x', 3)
			.attr('y', 26)
			.text((d) => d.value);
	};
</script>

<h2>See incidents for your age group!</h2>
<p>
	Explore more types of incidents in your age group. Make the age group bigger or smaller by
	adjusting the slider
</p>

<div id="slider" on:mount={initSlider} />

<svg />

<style lang="scss">
	@import '../../node_modules/nouislider/dist/nouislider.css';
	#slider {
		margin-top: 2.5rem;
		width: 80%;
		max-width: 800px;
		height: 20px;
	}

    svg {
        margin-top:1rem;
        margin-bottom:5rem;
        border: solid black 2px;
    }
</style>

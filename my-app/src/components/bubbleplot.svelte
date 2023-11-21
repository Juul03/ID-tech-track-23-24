<script>
	import { onMount } from 'svelte';
	import { formData } from '$lib/formDataStore';
	import noUiSlider from 'nouislider';
	import { select, scaleBand, scaleLinear, axisBottom, axisLeft } from 'd3';

	let incidentData = [];

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
				console.log('value.age', value.age);
				const newInterval = [newAge - 5, newAge + 5];
				console.log('newInterval', newInterval);

				// Update the values of the slider
				if (slider) {
					slider.set(newInterval); // Set the new values for the slider
					ageInterval = newInterval; // Update the ageInterval variable
				}
			}
		});
	};

	const filterDataByAgeInterval = () => {
		const filteredData = incidentData.filter((incident) => {
			const incidentAge = parseInt(incident.age);
			return incidentAge >= ageInterval[0] && incidentAge <= ageInterval[1];
		});
		return filteredData;
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
			findMaxAge();
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

		// createChart();
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

	// const createChart = () => {
	// 	// Calculate the svgWidth as 85% of the screen width
	// 	// TODO: update screenwidth on change
	// 	const screenWidth =
	// 		window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;

	// 	// svg geeft het formaat weer van de grafiek inclusief assen, de visualisationwidth is kleiner zodat er in de svg ruimte is om deze te laten zien
	// 	const svgWidth = screenWidth * 0.85;
	// 	const svgHeight = 500;
	// 	const visualisationWidth = svgWidth * 0.8;
	// 	const visualisationHeight = svgWidth * 0.8;

	// 	const padding = { top: 20, right: 20, bottom: 10, left: 20 };

	// 	const svg = select('svg').atrr('width', svgWidth).attr('height', svgHeight);
	// 	const gCircles = select('#circles')
	// 		.attr('width', visualisationWidth)
	// 		.attr('height', visualisationHeight);
	// const gXAxis = select('#xAxis').attr('transform', `translate(0, ${barsHeight})`);
	// const gYAxis = select('#yAxis').attr('transform', `translate(${barsWidth}, 0)`);

	// const amountOfIncidentTypes =
	// const incidentCount =

	// const xScale = scaleBand()
	// 	.domain(amountOfIncidentTypes)
	// 	.range([padding.left, visualisationWidth - padding.right])
	// 	.padding(0.1);
	// const yScale = scaleLinear()
	// 	.domain([0, Math.max(...incidentCount)])
	// 	.range([visualisationHeight - padding.bottom, padding.top]);

	// 	gCircles
	// 		.selectAll('rect')
	// 		.data(incidentCount)
	// 		.join('rect')
	// 		.attr('x', (d) => xScale(d))
	// 		.attr('y', (d) => yScale(ageCounts[d]))
	// 		.attr('width', xScale.bandwidth())
	// 		.attr('height', (d) => barsHeight - padding.bottom - yScale(ageCounts[d]))
	// 		.attr('fill', 'steelblue');
	// };

	// const createChart = (ageCounts) => {
	// 	const svgWidth = 2000;
	// 	const svgHeight = 500;
	// 	const barsWidth = svgWidth * 0.8;
	// 	const barsHeight = svgHeight * 0.8;

	// 	const padding = { top: 20, right: 20, bottom: 10, left: 20 };

	// 	const svg = select('#ageBarchart').attr('width', svgWidth).attr('height', svgHeight);
	// 	const gBars = select('#bars').attr('width', barsWidth).attr('height', barsHeight);
	// 	const gXAxis = select('#xAxis').attr('transform', `translate(0, ${barsHeight})`);
	// 	const gYAxis = select('#yAxis').attr('transform', `translate(${barsWidth}, 0)`);

	// 	const ages = Object.keys(ageCounts);
	// 	const counts = Object.values(ageCounts);

	// 	const xScale = scaleBand()
	// 		.domain(ages)
	// 		.range([padding.left, barsWidth - padding.right])
	// 		.padding(0.1);
	// 	const yScale = scaleLinear()
	// 		.domain([0, Math.max(...counts)])
	// 		.range([barsHeight - padding.bottom, padding.top]);

	// 	let xAxis = axisBottom(xScale);
	// 	select('#xAxis').call(xAxis);

	// 	let yAxis = axisLeft(yScale);
	// 	yAxis.ticks(11).tickSize(barsWidth - padding.left);
	// 	select('#yAxis').call(yAxis);
	// 	select('#yAxis').selectAll('.tick line').attr('stroke-dasharray', '5');

	// 	gBars
	// 		.selectAll('rect')
	// 		.data(ages)
	// 		.join('rect')
	// 		.attr('x', (d) => xScale(d))
	// 		.attr('y', (d) => yScale(ageCounts[d]))
	// 		.attr('width', xScale.bandwidth())
	// 		.attr('height', (d) => barsHeight - padding.bottom - yScale(ageCounts[d]))
	// 		.attr('fill', 'steelblue');

	// 	// Select and style the tick lines of the y-axis
	// 	select('#yAxis')
	// 		.selectAll('.tick line')
	// 		.attr('stroke', 'lightgrey')
	// 		.attr('stroke-dasharray', '2,2');
	// };
</script>

<h2>See incidents for your age group!</h2>
<p>Explore more types of incidents in your age group. Make the age group bigger or smaller by adjusting the slider</p>

<div id="slider" on:mount={initSlider} />

<svg />

<style lang="scss">
	@import '../../node_modules/nouislider/dist/nouislider.css';
	#slider {
        margin-top: 2.5rem;
		width: 80%;
        max-width:800px;
		height: 20px;
	}

	/* Example of increased specificity */
	#slider .noUi-target .noUi-base .noUi-origin .noUi-handle {
		/* Your custom styles */
		background-color: #4caf50 !important;
		border: 2px solid #4caf50 !important;
		/* Add more specific styles */
	}
</style>

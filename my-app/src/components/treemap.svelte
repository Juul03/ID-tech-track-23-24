<script>
	import { onMount } from 'svelte';
	import { formData } from '$lib/formDataStore';
	import noUiSlider from 'nouislider';
	import * as d3 from 'd3';

	let incidentData = [];
	let allIncidentsOccurences = {};

	// The variable that contains the filtered incidentData array op basis van de user input
	let filteredIncidentData = [];

	let slider;

	let minAge = 0;
	let maxAge = 100;
	let ageInterval = [minAge, maxAge];

	const initSlider = () => {
		let sliderContainer = document.getElementById('slider');

		// Check if slider container doesn't exist, then create it
		if (!sliderContainer) {
			sliderContainer = document.createElement('div');
			sliderContainer.id = 'slider';
			document.getElementById('slider-container').appendChild(sliderContainer);
		}

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
		slider.on('update', (values) => {
			ageInterval = values.map((value) => parseInt(value, 10));
			// Whenever the slider value changes, update the chart with the corresponding data
			updateChart();
		});
	};

	// Function to adjust the slider interval whenever the formdata input changes
	const adjustSliderOnChange = () => {
		// Subscribe to changes in the formData store
		formData.subscribe((value) => {
			const newAge = parseInt(value.age);
			if (!isNaN(newAge)) {
				const newInterval = [newAge - 5, newAge + 5];

				// Update the values of the slider
				if (slider) {
					slider.set(newInterval); // Set the new values for the slider
					ageInterval = newInterval; // Update the ageInterval variable
				}
			}

			updateChart();
		});
	};

	const filterDataByAgeInterval = () => {
		filteredIncidentData = incidentData.filter((incident) => {
			const incidentAge = parseInt(incident.age);
			return !isNaN(incidentAge) && incidentAge >= ageInterval[0] && incidentAge <= ageInterval[1];
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
			ageInterval[1] = maxAge;
		} else {
			console.error('No valid ages found in the dataset');
			maxAge = 100; // Set default
			ageInterval[1] = 100;
		}
	};

	// Fetch the JSON data
	const fetchJSONData = async () => {
		try {
			const response = await fetch('/data/output.json');
			if (response.ok) {
				incidentData = await response.json();
				allIncidentsOccurences = countIncidentTypeOccurrences(incidentData);
				findMaxAge();
				createChart();
			} else {
				console.error('Failed to fetch the data');
			}
		} catch (error) {
			console.error('Error fetching data:', error);
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
		adjustSliderOnChange();
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

	// Function to update the chart with filtered data
	const updateChart = () => {
		filteredIncidentData = filterDataByAgeInterval();
		createChart(filteredIncidentData);
	};

	const createChart = (filteredData) => {
		const data = filteredData ? countIncidentTypeOccurrences(filteredData) : allIncidentsOccurences;

		const screenWidth =
			window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;

		// svg geeft het formaat weer van de grafiek inclusief assen, de visualisationwidth is kleiner zodat er in de svg ruimte is om deze te laten zien
		const svgWidth = screenWidth * 0.9;
		let svgHeight = 500;
		const visualisationWidth = svgWidth * 0.8;
		const visualisationHeight = svgHeight * 0.8;

		let handleResize = () => {
			if (screenWidth < 500) {
				svgHeight = svgWidth + 200;
			} else {
				svgHeight = svgHeight;
			}
		};

		handleResize();
		// Add event listener for the window resize event
		window.addEventListener('resize', handleResize);

		const padding = { top: 10, right: 10, bottom: 10, left: 10 };

		// Extract the values (incident counts) from the incidentData object
		const incidentCounts = Object.values(allIncidentsOccurences);
		// Find the maximum incident count over all the incidents
		const maxTotalIncidents = Math.max(...incidentCounts);

		// Define a color scale using d3.scaleOrdinal()
		const colorForIncidents = d3
			.scaleOrdinal()
			.domain(incidentCounts)
			.range(d3.schemeCategory10.map((d) => d3.interpolateRgb(d, 'white')(0.5)));

		// Transform the incident data into a format suitable for the treemap layout
		const incidentEntries = Object.entries(data).map(([key, value]) => ({
			incidentType: key,
			value: value
		}));

		const svg = d3
			.select('svg')
			.attr('width', svgWidth)
			.attr('height', svgHeight)
			.attr('viewBox', `10, 10, ${visualisationWidth}, ${visualisationHeight}`)
			.attr('style', 'max-width: 100%; height: auto; font: 10px sans-serif; overflow: visible;');

		// Check if 'g' element exists within SVG
		let g = svg.select('g');

		// If 'g' doesn't exist, create it
		if (g.empty()) {
			g = svg.append('g').attr('transform', `translate(${padding.left}, ${padding.top})`);
		} else {
			// If 'g' exists, clear its content before adding new content
			g.selectAll('*').remove();
		}

		// Create the hierarchy structure using the transformed incident data
		const root = d3
			.hierarchy({ children: incidentEntries })
			.sum((d) => d.value)
			.sort((a, b) => b.value - a.value);

		// Construct the treemap layout
		const treemapLayout = d3
			.treemap()
			.size([visualisationWidth, visualisationHeight])
			.padding(2)
			.round(true);

		// Generate the treemap layout based on the root hierarchy
		treemapLayout(root);

		// Make the treemapLayout proportional
		let layout = () => {
			const totalFilteredIncidents = calculateTotalValue();
			const totalIncidents = incidentData.length;

			const k = Math.sqrt(totalFilteredIncidents / totalIncidents);
			// Calculate the translation factors
			const tx = (visualisationWidth - visualisationWidth * k) / 2;
			const ty = (visualisationHeight - visualisationHeight * k) / 2;

			return treemapLayout
				.size([visualisationWidth * k, visualisationHeight * k])(root)
				.each((d) => {
					d.x0 += tx;
					d.x1 += tx;
					d.y0 += ty;
					d.y1 += ty;
				})
				.leaves();
		};

		// Calculates the total value based on treemap data
		let calculateTotalValue = () => {
			// sum up the values of the data
			return root.sum((d) => d.value).value;
		};

		layout();

		const leaf = g
			.selectAll('g')
			.data(root.leaves())
			.join('g')
			.attr('transform', (d) => `translate(${d.x0},${d.y0})`);

		leaf
			.append('rect')
			.attr('fill', (d) => colorForIncidents(d.data.incidentType))
			.attr('stroke', 'var(--primary-color)')
			.attr('width', (d) => d.x1 - d.x0)
			.attr('height', (d) => d.y1 - d.y0)
			.attr('rx', '5px')
			.attr('ry', '5px');

		leaf
			.append('text')
			.attr('x', 3)
			.attr('y', 13)
			.text((d) => d.data.incidentType);

		leaf
			.append('text')
			.attr('x', 3)
			.attr('y', 26)
			.text((d) => d.value);

		leaf.on('click', (event, d) => {
			const incidentType = d.data.incidentType;
			const specificIncidentData = filteredData.filter(
				(incident) => incident.description_short === incidentType
			);

			const genderCountsFormatted = specificIncidentData.map((incident) => {
				const { description, gender } = incident;
				return { description, gender, value: 1 };
			});

			// Calculate the size and position of the parent leaf that is clicked
			const parentLeafWidth = d.x1 - d.x0;
			const parentLeafHeight = d.y1 - d.y0;

			const parentLeafX0 = d.x0;
			const parentLeafY0 = d.y0;

			const updatedRoot = d3
				.hierarchy({ children: genderCountsFormatted })
				.sum((d) => d.value)
				.sort((a, b) => b.value - a.value);

			treemapLayout.size([parentLeafWidth, parentLeafHeight]);
			treemapLayout(updatedRoot);

			const updateTreemap = (rootData) => {
				// Update the treemap structure based on the new data
				const updatedLeaf = g.selectAll('g').data(rootData.leaves(), (d) => d.data.gender);

				// Remove excess elements
				updatedLeaf.exit().remove();

				const enterSelection = updatedLeaf.enter().append('g');

				// Update rectangles in the update selection
				updatedLeaf
					.select('rect')
					.attr('x', (d) => parentLeafX0 + d.x0)
					.attr('y', (d) => parentLeafY0 + d.y0)
					.attr('width', (d) => d.x1 - d.x0)
					.attr('height', (d) => d.y1 - d.y0);

				// Append rectangles to the enter selection
				enterSelection
					.append('rect')
					.attr('fill', (d) => (d.data.gender === 'f' ? 'pink' : 'lightblue'))
					.attr('stroke', 'var(--primary-color)')
					.attr('x', (d) => parentLeafX0 + d.x0)
					.attr('y', (d) => parentLeafY0 + d.y0)
					.attr('width', 5)
					.attr('height', 5)
					.transition()
					.duration(2000)
					.ease(d3.easeBackInOut)
					.attr('width', (d) => d.x1 - d.x0)
					.attr('height', (d) => d.y1 - d.y0)
					.attr('rx', '5px')
					.attr('ry', '5px')
					.style('stroke', 'transparent');
			};

			// Call the update function with the updatedRoot data
			updateTreemap(updatedRoot);
		});
	};
</script>

<h2>See incidents for your age group!</h2>
<p>
	Explore more types of incidents in your age group. Make the age group bigger or smaller by
	adjusting the slider
</p>

<div id="slider" />

<svg>
	<div class="tooltip" />
</svg>

<style lang="scss">
	@import '../../node_modules/nouislider/dist/nouislider.css';
	@import '../../static/generalstyle.scss';
	#slider {
		margin-top: 2.5rem;
		width: 80%;
		max-width: 800px;
		height: 20px;
	}

	svg {
		margin-top: 1rem;
		margin-bottom: 5rem;
		border: solid var(--primary-color-light) 2px;
		border-radius: 10px;
	}
</style>

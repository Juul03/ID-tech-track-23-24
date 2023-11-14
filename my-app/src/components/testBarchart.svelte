<script>
	import { onMount } from 'svelte';
    import { select, scaleBand, scaleLinear, axisBottom, axisLeft } from 'd3';

	let incidentData = [];
    
	// Fetch the JSON data
	async function fetchJSONData() {
		const response = await fetch('src/data/output.json');
		if (response.ok) {
			incidentData = await response.json();
			countAgeOccurrences();
		} else {
			console.error('Failed to fetch the data');
		}
	}

	// Fetch the data when the component is mounted
	onMount(async () => {
		await fetchJSONData();
	});


	// Count the amount each age occures in the dataset
	const countAgeOccurrences = () => {
		const ageCounts = {};
		incidentData.forEach((incident) => {
			const age = incident.age;
			ageCounts[age] = (ageCounts[age] || 0) + 1;
		});

		createBarChart(ageCounts);
	};

	const createBarChart = (ageCounts) => {
		const svgWidth = 2000;
		const svgHeight = 500;
		const barsWidth = svgWidth * 0.8;
		const barsHeight = svgHeight * 0.8;

		const padding = { top: 20, right: 20, bottom: 10, left: 20 };

		const svg = select('#ageBarchart').attr('width', svgWidth).attr('height', svgHeight);
		const gBars = select('#bars').attr('width', barsWidth).attr('height', barsHeight);
		const gXAxis = select('#xAxis').attr('transform', `translate(0, ${barsHeight})`);
		const gYAxis = select('#yAxis').attr('transform', `translate(${barsWidth}, 0)`);

		const ages = Object.keys(ageCounts);
		const counts = Object.values(ageCounts);

		const xScale = scaleBand()
			.domain(ages)
			.range([padding.left, barsWidth - padding.right])
			.padding(0.1);
		const yScale = scaleLinear()
			.domain([0, Math.max(...counts)])
			.range([barsHeight - padding.bottom, padding.top]);

		let xAxis = axisBottom(xScale);
		select('#xAxis').call(xAxis);

		let yAxis = axisLeft(yScale);
		yAxis.ticks(11).tickSize(barsWidth - padding.left);
		select('#yAxis').call(yAxis);
		select('#yAxis').selectAll('.tick line').attr('stroke-dasharray', '5');

		gBars
			.selectAll('rect')
			.data(ages)
			.join('rect')
			.attr('x', (d) => xScale(d))
			.attr('y', (d) => yScale(ageCounts[d]))
			.attr('width', xScale.bandwidth())
			.attr('height', (d) => barsHeight - padding.bottom - yScale(ageCounts[d]))
			.attr('fill', 'steelblue');

		// Select and style the tick lines of the y-axis
		select('#yAxis')
			.selectAll('.tick line')
			.attr('stroke', 'lightgrey')
			.attr('stroke-dasharray', '2,2');
	};
</script>

<h2>Incidents reported in Universals/Disney world Orlando 2002 till 2022 by age-group</h2>
<svg id="ageBarchart">
	<g id="xAxis" />
	<g id="yAxis" />
	<g id="bars" />
</svg>

<style>
    h2#special {
        background:var(--primary-color);
    }
      

	/* svg {
		margin: 0 50px;
	} */
</style>

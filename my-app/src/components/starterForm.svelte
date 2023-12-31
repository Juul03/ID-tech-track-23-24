<script>
	import { fly } from 'svelte/transition';
	import { formData as formDataStore, updateFormData } from '$lib/formDataStore';
	import { confetti } from 'tsparticles-confetti';

	let incidentData = [];

	let formData = {
		gender: 'preferNotToSay',
		age: null
	};

	// Function to update the formData in the store
	const updateFormDataInStore = () => {
		updateFormData(formData);
	};

	const handleConfetti = () => {
		confetti({
			particleCount: 1000,
			spread: 100,
			origin: { y: 0.6 }
		});
	};

	let mostFrequentIncident = '';

	// Mapping object to replace incident types
	const incidentTypeMapping = {
		labor: 'get your baby born',
		'asthma attack': 'get a asthma attack',
		'change in mental status': 'get a change in mental status',
		stroke: 'get a stroke',
		seizure: 'have a seizure',
		dizziness: 'get dizzy',
		unconsciousness: 'get unconsious',
		'chest pain': 'have chest pain',
		'cardiac event': 'have a heart attack',
		'head injury': 'have a head injury',
		'short of breath': 'be short of breath',
		'fractured body part': 'to break a bone',
		'felt ill': 'feel unwell',
		numbness: 'feel numb',
		vomiting: 'to vomit',
		fell: 'fall',
		injury: 'get injured',
		pain: 'get pain'
	};

	const handleSubmit = async () => {
		// Convert age to a string, because in the dataset it is a string
		// TODO: use the csvToJsonConverter to parseInt the age from a string to a number and then delete this line
		const ageString = formData.age.toString();

		//TODO: When datatype of age in the dataset is parseInt, then change ageString to formData.age
		// fetch incidents for the selected gender and age
		const getIncidentsForAgeAndGender = await fetchIncident(formData.gender, ageString);

		// Count the incident that happens the most
		if (getIncidentsForAgeAndGender) {
			if (getIncidentsForAgeAndGender.length == 0) {
				mostFrequentIncident = 'be incident free';
				handleConfetti();
				// TODO:Functie als er niks gebeurt voor die persoon: NOTHING WILL HAPPEN TO YOU en confetti uiteraard
			} else {
				// Count the incident types
				const incidentTypeCounts = countIncidentTypeOccurrences(getIncidentsForAgeAndGender);
				mostFrequentIncident = getMostFrequentIncident(incidentTypeCounts);

				// Check if the incident type needs to be replaced,
				// replace it for a format that suits the "most likely" sentence in the html
				const formattedIncident = mostFrequentIncident;
				if (incidentTypeMapping[formattedIncident]) {
					mostFrequentIncident = incidentTypeMapping[formattedIncident];
				}
			}
		} else {
			console.error('No incidents found for the specified criteria.');
		}
	};

	let templateString = (incident) => {
		console.log(mostFrequentIncident);
	};

	const fetchIncident = async (gender, age) => {
		const response = await fetch('/data/output.json');
		if (response.ok) {
			incidentData = await response.json();

			if (gender === 'preferNotToSay') {
				// If gender is prefernottosay, fetch incidents for both male and female
				const incidentsForBothGenders = incidentData.filter(
					(entry) => entry.age === age && (entry.gender === 'f' || entry.gender === 'm')
				);

				return incidentsForBothGenders;
			} else {
				// Fetch incidents for the specified gender
				const filteredIncidents = incidentData.filter(
					(entry) => entry.age === age && entry.gender.toLowerCase() === gender.toLowerCase()
				);

				return filteredIncidents;
			}
		} else {
			console.error('Failed to fetch the data');
		}
	};

	const handleAgeInput = (event) => {
		// TODO: set maxValue to maxValue of data, the oldest age
		const inputValue = parseInt(event.target.value, 10);
		const maxValue = 89;

		if (inputValue > maxValue) {
			// Reset the value to the maximum allowed
			event.target.value = maxValue;
		}

		mostFrequentIncident = '';
	};

	// Watch for changes in formData.gender
	// Reactive statement to reset mostFrequentIncident when formData.gender changes
	$: {
		if (formData.gender !== 'preferNotToSay') {
			mostFrequentIncident = '';
		}
	}

	const countIncidentTypeOccurrences = (incidents) => {
		const incidentTypeCounts = {};
		incidents.forEach((incident) => {
			const incidentTypes = incident.description_short;
			incidentTypeCounts[incidentTypes] = (incidentTypeCounts[incidentTypes] || 0) + 1;
		});

		return incidentTypeCounts;
	};

	const getMostFrequentIncident = (incidentTypeCounts) => {
		let maxCount = 0;
		let mostFrequent = '';

		for (const incidentType in incidentTypeCounts) {
			if (incidentTypeCounts[incidentType] > maxCount) {
				maxCount = incidentTypeCounts[incidentType];
				mostFrequent = incidentType;
			}
		}

		return mostFrequent;
	};

	// Whenever the local formData changes, update the formData in the store
	$: updateFormDataInStore(formData);
</script>

<form on:submit|preventDefault={handleSubmit}>
	<legend>Which incident will happen to you?</legend>
	<fieldset>
		<legend>I identify as...</legend>
		<label>
			<input type="radio" name="gender" value="f" bind:group={formData.gender} />
			Female
		</label>
		<label>
			<input type="radio" name="gender" value="m" bind:group={formData.gender} />
			Male
		</label>
		<label>
			<input
				type="radio"
				name="gender"
				value="preferNotToSay"
				bind:group={formData.gender}
				checked
			/>
			Neither
		</label>
	</fieldset>

	<label for="age">I am...</label>
	<input
		type="number"
		id="age"
		bind:value={formData.age}
		min="0"
		max="89"
		on:input={handleAgeInput}
		required
	/>
	<span>years old</span>

	<button type="submit">Match my incident!</button>
</form>

{#if mostFrequentIncident !== ''}
	<p transition:fly={{ y: 50, duration: 500 }}>You are most likely to {mostFrequentIncident}</p>
{:else}
	<p transition:fly={{ y: 50, duration: 500 }} />
{/if}

<style lang="scss">
	form {
		width: 300px;
		height: 300px;
		margin: auto;
		border: 1px solid var(--accent-color);
		border-radius: 5%;
		padding: 20px;

		background: var(--secundary-color);
		box-shadow: 0 4px 8px var(--primary-color-drop-shadow);

		text-align: left;

		> legend {
			font-family: Waltograph, Verdana, Geneva, Tahoma, sans-serif;
			text-align: center;
			font-size: 1.5rem;
		}

		> label {
			margin: 0.5rem 0;
			font-weight: bold;
		}

		fieldset {
			border: none;
			margin: 1rem 0;
			display: flex;
			flex-wrap: wrap;

			> legend {
				display: block;
				font-weight: bold;
				text-align: left;
			}

			> label {
				flex: 1;
				padding: 0.5rem 0;
				text-align: left;
				color: var(--primary-color);

				transition: var(--standard-transition-time);

				&:hover {
					color: var(--primary-color-light);
					font-weight: bold;
					transform: scale(1.025);
				}

				&:nth-of-child(1),
				&:nth-of-child(2) {
					flex-basis: 50%;
				}
				&:last-of-type {
					flex-basis: 100%;
				}
			}
		}
		input[type='radio'] {
			appearance: none;
			-webkit-appearance: none;
			-moz-appearance: none;
			width: 1rem;
			height: 1rem;
			border-radius: 50%;
			border: 2px solid var(--primary-color-light);
			outline: none;
			cursor: pointer;
			margin-right: 0.5rem;

			transition: var(--standard-transition-time);

			&:hover {
				background: var(--primary-color-light);
			}
		}
		input[type='radio']:checked {
			background-color: var(--primary-color-light);
		}

		> input[type='number'] {
			padding: 0 0.5rem;
			margin: 0.5rem 0;
			height: 2rem;
			width: 3rem;

			border-radius: 5px;
			background: whitesmoke;
			border: solid 1px var(--primary-color-light);

			font-family: 'Waltograph', Verdana, Geneva, Tahoma, sans-serif;
			font-size: 1rem;
			color: var(--primary-color-light);
		}

		button {
			display: block;
			margin: 1rem auto;
			width: calc(100% - 1rem);
			max-width: 95%;
			padding: 0.8rem;
			background: var(--primary-color-light);
			border-radius: 5px;
			border: solid 1px transparent;
			color: var(--secundary-color);
			font-family: Waltograph, Verdana, Geneva, Tahoma, sans-serif;
			font-size: 1rem;

			transition: ease-in-out var(--standard-transition-time);

			&:hover {
				background: var(--secundary-color);
				color: var(--primary-color-light);
				border: solid 1px var(--primary-color);
				transform: scale(1.025);
			}
		}
	}

	p {
		transform: translateY(100%);
		color: white;
		width: 50%;
		margin: auto;
		text-align: center;
	}

	@media screen and (max-width: 500px) {
		form {
			width: 75%;
			max-width: 100%;

			button {
				bottom: 5%;
			}
		}
	}
</style>

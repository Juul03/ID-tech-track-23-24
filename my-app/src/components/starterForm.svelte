<script>
	let incidentData = [];

	let formData = {
		gender: 'preferNotToSay',
		age: null
	};

	const handleSubmit = async () => {
		console.log('Form submitted!', formData);
		// Convert age to a string, because in the dataset it is a string
		// TODO: use the csvToJsonConverter to parseInt the age from a string to a number and then delete this line
		const ageString = formData.age.toString();

		//TODO: When datatype of age in the dataset is parseInt, then change ageString to formData.age
		const incidents = await fetchIncident(formData.gender, ageString);

        //TODO: If incidents.map(incident => incidents.description contains "passed away" or "death", show a warning with: ...and a slightly small change of death)
		
		// TODO:Reset form fields: formData = { gender: '', age: null };
	};

	const fetchIncident = async (gender, age) => {
		const response = await fetch('src/data/output.json');
		if (response.ok) {
			incidentData = await response.json();

			if (gender === 'preferNotToSay') {
				// If gender is prefernottosay, fetch incidents for both male and female
				const incidentsForBothGenders = incidentData.filter(
					(entry) => entry.age === age && (entry.gender === 'f' || entry.gender === 'm')
				);

				// return incidentsForBothGenders;
                console.log(incidentsForBothGenders);
			} else {
				// Fetch incidents for the specified gender
				const filteredIncidents = incidentData.filter(
					(entry) => entry.age === age && entry.gender.toLowerCase() === gender.toLowerCase()
				);

				// return filteredIncidents;
                console.log(filteredIncidents);
			}
		} else {
			console.error('Failed to fetch the data');
		}
	};

	const handleAgeInput = (event) => {
		// TODO: set maxValue to maxValue of data, the oldest age
		const inputValue = parseInt(event.target.value, 10);
		const maxValue = 110;

		if (inputValue > maxValue) {
			// Reset the value to the maximum allowed
			event.target.value = maxValue;
		}
	};
</script>

<form on:submit|preventDefault={handleSubmit}>
	<legend>Which incident will happen to you?</legend>
	<!-- TODO: change gender fieldset to dropdown menu = more compact -->
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
			None/Prefer not to say
		</label>
	</fieldset>

	<label for="age">I am...</label>
	<input
		type="number"
		id="age"
		bind:value={formData.age}
		min="0"
		max="110"
		on:input={handleAgeInput}
		required
	/>
	<span>years old</span>

	<button type="submit">Match my incident!</button>
</form>

<style lang="scss">
	form {
		width: 300px;
		height: 300px;
		margin: auto;
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		border: 1px solid var(--accent-color);
		border-radius: 5%;
		padding: 20px;

		background: var(--secundary-color);

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
			}

			> label {
				flex: 1;
				padding: 0.5rem 0;

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
			width: 1rem; /* Customize the width and height */
			height: 1rem;
			border-radius: 50%; /* Make it round */
			border: 2px solid var(--text-color); /* Add border */
			outline: none;
			cursor: pointer;
			margin-right: 0.5rem;

			transition: var(--standard-transition-time);
		}
		input[type='radio']:checked {
			background-color: var(--text-color);
		}

		> input[type='number'] {
			padding: 0 0.5rem;
			margin: 0.5rem 0;
			height: 2rem;
			width: 3rem;

			border-radius: 5px;
			background: whitesmoke;
			border: solid 1px var(--text-color);

			font-family: 'Waltograph', Verdana, Geneva, Tahoma, sans-serif;
			font-size: 1rem;
			color: var(--text-color);
		}

		button {
			display: block;
			position: absolute;
			bottom: 10%;
			left: 50%;
			transform: translate(-50%, 0%);

			width: 85%;
			padding: 0.8rem;
			background: var(--text-color);
			border-radius: 5px;
			border: solid 1px transparent;

			color: var(--primary-color);
			font-family: Waltograph, Verdana, Geneva, Tahoma, sans-serif;
		}
	}

	@media screen and (max-width: 550px) {
		form {
			width: 75%;
			max-width: 100%;
		}
	}
</style>

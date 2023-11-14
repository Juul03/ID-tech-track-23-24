<script>
	let formData = {
		gender: '', // To store selected gender
		age: null // To store selected age
	};

	async function handleSubmit() {
		// Handle form submission logic here
		console.log('Form submitted!', formData);
		// Perform any API requests, form validation, etc.
		// Reset form fields if needed: formData = { gender: '', age: null };
	}

    function handleAgeInput(event) {
    const inputValue = parseInt(event.target.value, 10);
    const maxValue = 110;

    if (inputValue > maxValue) {
      event.target.value = maxValue; // Reset the value to the maximum allowed
    }
  }
</script>

<form on:submit|preventDefault={handleSubmit}>
	<fieldset>
		<legend>Gender:</legend>
		<label>
			<input type="radio" name="gender" value="female" bind:group={formData.gender} />
			Female
		</label>
		<label>
			<input type="radio" name="gender" value="male" bind:group={formData.gender} />
			Male
		</label>
		<label>
			<input type="radio" name="gender" value="preferNotToSay" bind:group={formData.gender} />
			Prefer not to say
		</label>
	</fieldset>

    <label for="age">Age:</label>
    <input
      type="number"
      id="age"
      bind:value={formData.age}
      min="0"
      max="110"
      on:input={handleAgeInput}
    />

	<button type="submit">Submit</button>
</form>

<style>
	/* Style your form elements here */
</style>

import csvtojson from 'csvtojson';
import { writeFile } from 'fs/promises';
import path from 'path';

const csvFilePath = path.resolve('static/data/data.csv');
// Why not just this?
// const csvFilePath = 'src/data/data.csv';
// Because of the static file, resolve makes the path absolute so it is relative from every directory it is accessed from

const padWithZero = (num) => {
	if (num < 10) {
		return `0${num}`;
	} else {
		return num;
	}
};

// Function to get short description based on keywords
const getDescriptionShort = (description) => {
	const keywordMapping = {
    // Setting most specific causes at the top and more general at the bottom, to get the most adequate description
    "labor": ['Labor'],
    "asthma attack": ['Asthma attack'],
    "change in mental status": ['Altered mental status', 'Change in mental status'],
    "stroke": ['Stroke'],
    "seizure": ['Seizure'],
		"dizziness": ['Feeling Dizzy', 'Dizziness', 'Dizzy', 'Motion Sickness', 'Nauseous', 'Nausea', 'Vertigo', 'Saw spots', 'Light headed', 'Lightheaded', 'Weakness', 'Feeling weak', 'Felt faint', 'Disorientation', 'Disoriented', 'Confusion'],
		"unconsciousness": ['Unconsciousness', 'Unconscious', 'Loss of consciousness', 'consciousness', 'Fainted', 'Fainting', 'Syncope', 'Unresponsive', 'Incoherent', 'Memory loss', 'Passed out', 'Collapsed'],
    "chest pain": ['Chest pain', 'Difficulty breathing', 'Trouble breathing', 'Chest discomfort', 'Tightness in chest'],
    "cardiac event": ['Cardiac event', 'Cardiac symptoms', 'Cardiac arrest', 'Heart attack', 'Hypertension', 'Chest palpitations', 'Atrial fibrilation', 'Pacemaker'],
    "head injury": ['Head laceration', 'Head pain', 'Head and neck pain', 'Eye discomfort', 'In eye irritation'],
    "short of breath": ['Short of breath', 'Anaphylactic reactions', 'Breathing problems'],
    "fractured body part": ['Fractured', 'Fractures', 'Fracture', 'Broken', 'Broke', 'Lacerated'],
    "felt ill": ['Felt ill', 'Felt unwell', 'Not been feeling well', 'General Illness', 'Illness', 'Ill', 'Sick', 'Stomach pain', 'Headache', 'Hermatemesis', 'Not feeling well', 'DidnÃ¢ÂÂt feel well'],
    "numbness": ['Numbness', 'Difficulty moving', 'Difficult moving'],
    "vomiting": ['Vomiting', 'Vomited', 'Vomited'],
    "fell": ['Fell', 'Fall'],
    "injury": ['Injury', 'Injured', 'Laceration', 'Hit', 'Reoccurrence'],
    "pain": ['Pain']
	};

  // Creates the short description that matches the first keyword (from top to bottom) 
	for (const keyword in keywordMapping) {
		if (Array.isArray(keywordMapping[keyword]) && keywordMapping[keyword].some(key => description.toLowerCase().includes(key.toLowerCase()))) {
			return keyword;
		}
	}
	return 'Other';
};

csvtojson()
	.fromFile(csvFilePath)
	.then((json) => {
		// Update the Incident_date field in each object
		const formattedJSON = json.map((obj) => {
			const parts = obj.Incident_date.split('/');
			// Check if the date needs formatting
			if (parts.length === 3) {
				const month = parseInt(parts[0]);
				const day = parseInt(parts[1]);
				// Check if the date parts represent a valid date in MM/DD/YYYY format
				if (!isNaN(month) && !isNaN(day) && month >= 1 && month <= 12 && day >= 1 && day <= 31) {
					const year = parts[2].slice(-2); // Extract the last two digits of the year
					const formattedDate = `${padWithZero(day)}/${padWithZero(month)}/${year}`;
					obj.Incident_date = formattedDate;
				}
			}

			// Split age_gender into age and gender
			const ageGenderParts = obj.age_gender.split(' ');
			if (ageGenderParts.length === 2) {
				let age = ageGenderParts[0];
				age = parseInt(age);
				const gender = ageGenderParts[1].slice(-1); // Extract the last character for gender
				// Add new attributes age and gender to the object
				obj.age = `${age}`;
				obj.gender = `${gender}`;
			}

			// Get short description based on keywords
			const shortDescription = getDescriptionShort(obj.description);
			obj.description_short = shortDescription;

			return obj;
		});

		// Save the JSON data to a file
		writeFile('static/data/output.json', JSON.stringify(formattedJSON, null, 2))
			.then(() => {
				console.log('Conversion completed. JSON data saved to output.json');
			})
			.catch((err) => {
				console.error('Error writing the file:', err);
			});
	})
	.catch((err) => {
		console.error('Error:', err);
	});

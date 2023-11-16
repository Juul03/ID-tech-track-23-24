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
}

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

      return obj;
    });

    // Save the JSON data to a file
    writeFile('src/data/output.json', JSON.stringify(formattedJSON, null, 2))
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

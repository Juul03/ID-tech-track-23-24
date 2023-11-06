import csvtojson from 'csvtojson';
import { writeFile } from 'fs/promises';

const csvFilePath = 'my-app/static/data/data.csv';

csvtojson()
  .fromFile(csvFilePath)
  .then((json) => {
    // Save the JSON data to a file
    writeFile('my-app/src/data/output.json', JSON.stringify(json, null, 2))
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


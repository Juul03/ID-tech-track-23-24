import { readFile } from 'fs/promises';
import path from 'path';

export async function readCSVFile() {
  try {
    const csvFilePath = path.resolve('static/data/incidentdata.csv');
    const content = await readFile(csvFilePath, 'utf-8');
    return content;
  } catch (error) {
    console.error('Error reading the file:', error);
    return null;
  }
}

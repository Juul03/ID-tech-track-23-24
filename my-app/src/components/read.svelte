<script>
    import { readCSVFile } from '$lib/readCSVFile';
  
    async function fetchCSVData() {
      const content = await readCSVFile();
      console.log('CSV File Content:', content);
    }
  
    fetchCSVData();
</script>
  
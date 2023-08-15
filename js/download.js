"use strict";

// Function to generate CSV content asynchronously
async function generateCSVContent(dataset) {
  let csvContent =
    "Year,Latitude,Longitude,Country,Type1,Type2,Type3,Type4,Source,\n";

  for (const [year, data] of Object.entries(dataset)) {
    for (const obj of data) {
      //console.log(obj.COUNTR);
      csvContent += `${obj.YEAR},${obj.Y},${obj.X},"${obj.COUNTR}",${obj.DEN1},${obj.DEN2},${obj.DEN3},${obj.DEN4},${obj.SOURCE}\n`;
    }
  }

  //console.log(csvContent);
  return csvContent;
}

// Function to create a Blob from CSV content
function createBlob(csv) {
  return new Blob([csv], { type: "text/csv" });
}

// Function to download Blob as a file
function downloadBlobAsFile(blob, fileName = "TEA-DS.csv") {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  a.click();
  URL.revokeObjectURL(url);
}

// Function to initiate the download process
async function callDownload() {
  try {
    const csvContent = await generateCSVContent(dataset);
    const blob = createBlob(csvContent);
    downloadBlobAsFile(blob);
  } catch (error) {
    console.error("Error generating or downloading CSV:", error);
  }
}

// Function to filter the dataset based on the countries in the category
async function filterDataset(dataset, category) {
  const filteredDataset = {};
  for (const [year, data] of Object.entries(dataset)) {
    filteredDataset[year] = data.filter((obj) =>
      category.countryList.includes(obj.COUNTR)
    );
  }
  return filteredDataset;
}

// Function to calculate midpoints from the filtered dataset
async function calculateMidpointDataset(dataset) {
  const midpointDataset = {};
  for (const [year, data] of Object.entries(dataset)) {
    let Midpoints = {
      Main_lat: [],
      Main_lon: [],
      Type1_lat: [],
      Type1_lon: [],
      Type2_lat: [],
      Type2_lon: [],
      Type3_lat: [],
      Type3_lon: [],
      Type4_lat: [],
      Type4_lon: [],
    };
    midpointDataset[year] = data.map((obj) => {
      Midpoints.Main_lat.push(obj.Y);
      Midpoints.Main_lon.push(obj.X);
      if (obj.DEN1 == 1) {
        Midpoints.Main_lat.push(obj.Y);
        Midpoints.Main_lon.push(obj.X);
      }
      if (obj.DEN2 == 1) {
        Midpoints.Type2_lat.push(obj.Y);
        Midpoints.Type2_lon.push(obj.X);
      }
      if (obj.DEN3 == 1) {
        Midpoints.Type3_lat.push(obj.Y);
        Midpoints.Type3_lon.push(obj.X);
      }
      if (obj.DEN4 == 1) {
        Midpoints.Type4_lat.push(obj.Y);
        Midpoints.Type4_lon.push(obj.X);
      }
      return;
    });
    midpointDataset[year] = {
      Year: year,
      Main_lat: (Midpoints.Main_lat.length > 0 ? mean(Midpoints.Main_lat) : "NULL"),
      Main_lon: (Midpoints.Main_lon.length > 0 ? mean(Midpoints.Main_lon) : "NULL"),
      Type1_lat: (Midpoints.Type1_lat.length > 0 ? mean(Midpoints.Type1_lat) : "NULL"),
      Type1_lon: (Midpoints.Type1_lon.length > 0 ? mean(Midpoints.Type1_lon) : "NULL"),
      Type2_lat: (Midpoints.Type2_lat.length > 0 ? mean(Midpoints.Type2_lat) : "NULL"),
      Type2_lon: (Midpoints.Type2_lon.length > 0 ? mean(Midpoints.Type2_lon) : "NULL"),
      Type3_lat: (Midpoints.Type3_lat.length > 0 ? mean(Midpoints.Type3_lat) : "NULL"),
      Type3_lon: (Midpoints.Type3_lon.length > 0 ? mean(Midpoints.Type3_lon) : "NULL"),
      Type4_lat: (Midpoints.Type4_lat.length > 0 ? mean(Midpoints.Type4_lat) : "NULL"),
      Type4_lon: (Midpoints.Type4_lon.length > 0 ? mean(Midpoints.Type4_lon) : "NULL"),
    };
    //console.log(midpointDataset);
  }
  return midpointDataset;
}

// Function to generate Midpoint CSV content asynchronously
async function generateCSVMidpointContent(dataset) {
  let csvContent =
    "Year,Main_lat,Main_lon,Type1_lat,Type1_lon,Type2_lat,Type2_lon,Type3_lat,Type3_lon,Type4_lat,Type4_lon,\n";
  for (const [year, data] of Object.entries(dataset)) {
    csvContent += `${data.Year},${data.Main_lat},${data.Main_lon},`;
    csvContent += `${data.Type1_lat},${data.Type1_lon},`;
    csvContent += `${data.Type2_lat},${data.Type2_lon},`;
    csvContent += `${data.Type3_lat},${data.Type3_lon},`;
    csvContent += `${data.Type4_lat},${data.Type4_lon},\n`;
  }
  return csvContent;
}

/* -- DOWNLOAD CATEGORY DATA -- */
async function callCategoryDownload(category) {
  //console.log(category);
  try {
    const filteredDataset = await filterDataset(dataset, category);
    const csvContent = await generateCSVContent(filteredDataset);
    const blob = createBlob(csvContent);
    const fileName = category.name + ".csv";
    downloadBlobAsFile(blob, fileName);
    const midpointDataset = await calculateMidpointDataset(filteredDataset);
    const csvMidpointContent = await generateCSVMidpointContent(
      midpointDataset
    );
    const blobMidpoint = createBlob(csvMidpointContent);
    const fileNameMidpoint = category.name + "_Midpoints.csv";
    downloadBlobAsFile(blobMidpoint, fileNameMidpoint);
  } catch (error) {
    console.error("Error generating or downloading CSV:", error);
  }
}

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
function downloadBlobAsFile(blob, fileName = "GeoDEN.csv") {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  a.click();
  URL.revokeObjectURL(url);
}

// Function to initiate the download process - Called from Index HTML
async function callDownload() {
  try {
    const csvContent = await generateCSVContent(dataset);
    const blob = createBlob(csvContent);
    downloadBlobAsFile(blob);
    alert("Downloaded GeoDEN.csv");
  } catch (error) {
    console.error("Error generating or downloading CSV:", error);
  }
}

/* --------------------------------------------------*/

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
  const nullValue = "ERR";
  const mainType = "ANY";
  const midpointDataset = [];

  function generateRow(year, type, latitudes, longitudes) {
    return {
      Year: year,
      Type: type,
      Lat: latitudes.length > 0 ? mean(latitudes) : nullValue,
      Lon: longitudes.length > 0 ? mean(longitudes) : nullValue,
      Reports: latitudes.length,
    };
  }

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
    data.map((obj) => {
      Midpoints.Main_lat.push(obj.Y);
      Midpoints.Main_lon.push(obj.X);
      if (obj.DEN1 == 1) {
        Midpoints.Type1_lat.push(obj.Y);
        Midpoints.Type1_lon.push(obj.X);
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

    if (Midpoints.Main_lat.length > 0) {
      midpointDataset.push(
        generateRow(year, mainType, Midpoints.Main_lat, Midpoints.Main_lon)
      );
    }
    if (Midpoints.Type1_lat.length > 0) {
      midpointDataset.push(
        generateRow(year, 1, Midpoints.Type1_lat, Midpoints.Type1_lon)
      );
    }
    if (Midpoints.Type2_lat.length > 0) {
      midpointDataset.push(
        generateRow(year, 2, Midpoints.Type2_lat, Midpoints.Type2_lon)
      );
    }
    if (Midpoints.Type3_lat.length > 0) {
      midpointDataset.push(
        generateRow(year, 3, Midpoints.Type3_lat, Midpoints.Type3_lon)
      );
    }
    if (Midpoints.Type4_lat.length > 0) {
      midpointDataset.push(
        generateRow(year, 4, Midpoints.Type4_lat, Midpoints.Type4_lon)
      );
    }

    /*{
        Year: year,
        Type:
          Midpoints.Main_lat.length > 0 ? mean(Midpoints.Main_lat) : nullValue,
        Lat:
          Midpoints.Main_lon.length > 0 ? mean(Midpoints.Main_lon) : nullValue,
        Lon:
          Midpoints.Type1_lat.length > 0
            ? mean(Midpoints.Type1_lat)
            : nullValue,
      };*/
    //console.log(Midpoints);
    //console.log(midpointDataset);
    /*
    midpointDataset[year] = {
      Year: year,
      Main_lat:
        Midpoints.Main_lat.length > 0 ? mean(Midpoints.Main_lat) : "NULL",
      Main_lon:
        Midpoints.Main_lon.length > 0 ? mean(Midpoints.Main_lon) : "NULL",
      Type1_lat:
        Midpoints.Type1_lat.length > 0 ? mean(Midpoints.Type1_lat) : "NULL",
      Type1_lon:
        Midpoints.Type1_lon.length > 0 ? mean(Midpoints.Type1_lon) : "NULL",
      Type2_lat:
        Midpoints.Type2_lat.length > 0 ? mean(Midpoints.Type2_lat) : "NULL",
      Type2_lon:
        Midpoints.Type2_lon.length > 0 ? mean(Midpoints.Type2_lon) : "NULL",
      Type3_lat:
        Midpoints.Type3_lat.length > 0 ? mean(Midpoints.Type3_lat) : "NULL",
      Type3_lon:
        Midpoints.Type3_lon.length > 0 ? mean(Midpoints.Type3_lon) : "NULL",
      Type4_lat:
        Midpoints.Type4_lat.length > 0 ? mean(Midpoints.Type4_lat) : "NULL",
      Type4_lon:
        Midpoints.Type4_lon.length > 0 ? mean(Midpoints.Type4_lon) : "NULL",
    };
    //console.log(midpointDataset);*/
  }
  return midpointDataset;
}

// Function to generate Midpoint CSV content asynchronously
async function generateCSVMidpointContent(dataset) {
  let csvContent = "Year,Type,Lat,Lon,Reports,\n";
  /*for (year in dataset) {
    console.log(year);
  }*/
  for (const [year, data] of Object.entries(dataset)) {
    csvContent += `${data.Year},${data.Type},${data.Lat},${data.Lon},${data.Reports},\n`; /*
    csvContent += `${data.Type1_lat},${data.Type1_lon},`;
    csvContent += `${data.Type2_lat},${data.Type2_lon},`;
    csvContent += `${data.Type3_lat},${data.Type3_lon},`;
    csvContent += `${data.Type4_lat},${data.Type4_lon},\n`;*/
  }
  return csvContent;
}

/* -- DOWNLOAD CATEGORY DATA -- Called from Index HTML -- */
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
    const fileNameMidpoint = category.name + "_Centroids.csv";
    downloadBlobAsFile(blobMidpoint, fileNameMidpoint);
    alert("Downloaded " + fileName + " and " + fileNameMidpoint);
  } catch (error) {
    console.error("Error generating or downloading CSV:", error);
  }
}

/* --------------------------------------------------*/
async function calculateCooccuranceDataset() {}

async function generateCSVOccuranceContent(statsMapArray) {
  let csvContent = "Region,Total,Serotype 1,Serotype 2,Serotype 3,Serotype 4,Serotypes 123,Serotypes 124,Serotypes 134,Serotypes 234,Serotypes 1234\n";
  csvContent += `All,${statsMap.events},${statsMap.c1},${statsMap.c2},${statsMap.c3},${statsMap.c4},${statsMap.c123},${statsMap.c124},${statsMap.c134},${statsMap.c234},${statsMap.c1234}\n`;
  csvContent += `,,,,,,,,,\n`
  for (let i = 0; i < statsMapArray.length; i++) {
    const statsMap = statsMapArray[i];
    csvContent += `${statsMap.name},${statsMap.events},${statsMap.c1},${statsMap.c2},${statsMap.c3},${statsMap.c4},${statsMap.c123},${statsMap.c124},${statsMap.c134},${statsMap.c234},${statsMap.c1234}\n`;
  }

  return csvContent;
}

async function callOccuranceDownload() {
  try {
    const statsMapArray = calculateCooccuranceStats();
    const csvContent = await generateCSVOccuranceContent(statsMapArray);
    const blob = createBlob(csvContent);
    const timeRange = calculateTimeRange();
    if (timeRange[0] == timeRange[1]) {
      downloadBlobAsFile(blob, "CoOccuranceReport_" + timeRange[0] + ".csv");
      alert("Downloaded Co-Occurance Report: " + timeRange[0]);
    } else {
      downloadBlobAsFile(blob, "CoOccuranceReport_" + timeRange[0] + "-" + timeRange[1] + ".csv");
      alert("Downloaded Co-Occurance Report: " + timeRange[0] + "-" + timeRange[1]); 
    }
    
  } catch (error) {
    console.error("Error generating or downloading CSV:", error);
  }
}

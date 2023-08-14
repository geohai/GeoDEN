"use strict";

// Function to generate CSV content asynchronously
async function generateCSVContent(dataset) {
  let csvContent =
    "Year,Latitude,Longitude,Country,Type_1,Type_2,Type_3,Type_4,Source,\n";

  for (const [year, data] of Object.entries(dataset)) {
    for (const obj of data) {
      console.log(obj.COUNTR);
      csvContent += `${obj.YEAR},${obj.X},${obj.Y},"${obj.COUNTR}",${obj.DEN1},${obj.DEN2},${obj.DEN3},${obj.DEN4},${obj.SOURCE}\n`;
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
function downloadBlobAsFile(blob) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "DF-TEA.csv";
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

function callCategoryDownload(category) {
    console.log(category);
}
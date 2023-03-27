let categoryGroups = [];
// Americas
let category1 = [
  [
    "Anguilla",
    "Aruba",
    "Bahamas",
    "Barbados",
    "Belize",
    "Virgin Islands, British",
    "Colombia",
    "Costa Rica",
    "Cuba",
    "Dominica",
    "Dominican Republic",
    "El Salvador",
    "French Guiana",
    "Grenada",
    "Guatemala",
    "Guyana",
    "Haiti",
    "Honduras",
    "Nicaragua",
    "Paraguay",
    "Puerto Rico",
    "Suriname",
    "Trinidad and Tobago",
    "Argentina",
    "Brazil",
    "Peru",
    "Bolivia",
    "Chile",
    "Mexico",
    "Ecuador",
    "French Antilles",
    "Jamaica",
    "Netherlands Antilles",
    "Panama",
    "Saint Kitts and Nevis",
    "St. Kitts & Nevis",
    "Saint Lucia",
    "United States of America",
    "Venezuela",
    "Turks & Caicos Islands",
    "Virgin Islands, U.S.",
    "Antigua and Barbuda",
    "St. Vincent & the Grenadines",
    "Cayman Islands",
  ],
  {},
  [],
  "Americas",
  "#702c1e",
];
// Africa
let category2 = [
  [
    "Angola",
    "Burkina Faso",
    "Cameroon",
    "Cote d'Ivoire",
    "Djibouti",
    "Ethiopia",
    "Gabon",
    "Benin",
    "Guinea",
    "Madagascar",
    "Nigeria",
    "Senegal",
    "Seychelles",
    "Cape Verde",
    "Mali",
    "Comoros",
    "Ghana",
    "Eritrea",
    "Portugal",
    "France -  Mayotte",
    "Mozambique",
    "France - Reunion",
    "Saudi Arabia",
    "Somalia",
    "Yemen",
    "Sudan",
    "Tanzania",
    "Kenya",
  ],
  {},
  [],
  "Africa",
  "#1e3f70",
];
// Asia
let category3 = [
  [
    "Cambodia",
    "Cook Islands",
    "Fiji",
    "French Polynesia",
    "Kiribati",
    "Lao PDR",
    "Malaysia",
    "Maldives",
    "Marshall Islands",
    "New Caledonia",
    "Niue",
    "Pakistan",
    "Palau",
    "Philippines",
    "Samoa",
    "Singapore",
    "Sri Lanka",
    "Timor-Leste",
    "Tonga",
    "Myanmar",
    "Papua New Guinea",
    "Solomon Islands",
    "Vietnam",
    "American Samoa",
    "Australia",
    "Bangladesh",
    "Bhutan",
    "French Guiana",
    "Brunei Darussalam",
    "China",
    "Taiwan",
    "Thailand",
    "India",
    "Indonesia",
    "Guam",
    "Japan",
    "Micronesia, Federated States of",
    "Nauru",
    "Nepal",
    "Vanuatu",
    "Wallis and Futuna",
  ],
  {},
  [],
  "Asia",
  "#1e7021",
];
let category4 = [[], {}, [], "name", "red"];
let category5 = [[], {}, [], "name", "red"];
let category6 = [[], {}, [], "name", "red"];
let category7 = [[], {}, [], "name", "red"];
let category8 = [[], {}, [], "name", "red"];
//let category

let regionalMidpoints = true;
let serotypeMidpoints = false;

//Import data, add it to the map, and add sequence controls
function getData(map) {
  $.get("data/DENV_types.csv", function (csvString) {
    // Use PapaParse to convert string to array of objects
    let data = Papa.parse(csvString, {
      header: true,
      dynamicTyping: true,
    }).data;

    // Make the dataset keys as the years to hold all datapoints for each year
    dataset = {};
    for (let i = 1943; i < 2014; i++) {
      dataset[i] = [];
    }

    // For each row in data, add it to its year row in the dataset object
    for (let i = 0; i < data.length - 1; i++) {
      let row = data[i];
      let year = row.YEAR;

      dataset[year].push(row);
    }

    // function here to set category groups

    // This gets all points, adds them to the layer group and
    updateSymbols(activeYear);
  });

  createSequenceControls();
}

// delete current points and add correct points for given year
function updateSymbols(index, reset = false) {
  // Set active year to index
  activeYear = index;

  // just define what categories to look through
  categoryGroups = [category1, category2, category3];

  // remove points that aren't relavent
  removeUnnecessaryPoints(reset);

  // add correct points to objects and to map
  selectPoints();

  // calc statistics--essentially just count number of points of each serotype

  // make central point
  calculateMidpoint();
  // for each object in each category...
  // for each leaflet marker in each category...
  // if type 1 is present && type1_active || type 2 is present and type2_active ||...
  // add lat and long to array.  Calculate average lat from array, calculate average lng from array
  // plot averages as a new point (its own leaflet point in the category list as index 2)
  // if average == undefined, don't plot.  Always remove layer from map at the start, like how map used to work.

  // Update Header
  updateHeadingContent();
}

// function to find years that are not relavent, and remove them from the list and clear from the map
function removeUnnecessaryPoints(reset) {
  // itterate through the list of categories
  for (category in categoryGroups) {
    // clear midpoints
    if (categoryGroups[category][2].length > 0) {
      for (layer in categoryGroups[category][2]) {
        categoryGroups[category][2][layer].clearLayers();
        delete categoryGroups[category][2][layer];
      }
      categoryGroups[category][2] = [];

      //delete categoryGroups[category][2]
    }

    // if reset, remove all years
    if (reset) {
      //itterate through the category dict, analyzing each year
      for (year in categoryGroups[category][1]) {
        categoryGroups[category][1][year].clearLayers();
        delete categoryGroups[category][1][year];
      }
      // otherwise, just remove needed years
    } else {
      //itterate through the category dict, analyzing each year
      for (year in categoryGroups[category][1]) {
        // if a key is greater than the year being looked at or less that the year being looked at, remove it
        if (year > activeYear || year < activeYear - yearDelay) {
          //remove year
          //console.log() // activeLayerGroups[cat]
          categoryGroups[category][1][year].clearLayers();
          delete categoryGroups[category][1][year];
        }
      }
    }
  }

  //console.log(categoryGroups[category][2]);
  //categoryGroups[category][2][0].clearLayers();
}

//Function to layer groups that do not correspond to years in question
function selectPoints() {
  // for category in list of categories
  for (category in categoryGroups) {
    //console.log(categoryGroups[category[1]])
    // for each year of year delay
    for (let i = 0; i <= yearDelay; i++) {
      let year = activeYear - i;
      // if that year is not in the category...
      if (!(year in categoryGroups[category][1])) {
        // get that years points, and make them a layer group
        let dataPoints = getDataPoints(year, categoryGroups[category][0]);
        let points = [];
        for (item in dataPoints) {
          let row = dataPoints[item];
          let point = pointToLayer(row);
          points.push(point);
        }
        // add the generated layer group to the category object and the map
        categoryGroups[category][1][year] = L.layerGroup(points);
        categoryGroups[category][1][year].addTo(map);
      }
    }
  }
}

//
function getDataPoints(year, categoryList) {
  //console.log(categoryList);
  let tempData = dataset[year];
  let points = [];
  for (i in tempData) {
    // later check if in the categoryList, which will equal all countries in that category
    if (categoryList.includes(tempData[i].COUNTR)) {
      points.push(tempData[i]);
    }
  }
  return points;
}

//funciton to calculate midpoints of category
function calculateMidpoint() {
  let categories;
  if (regionalMidpoints) {
    categories = categoryGroups;
  } //ELSE calculate categories based on DB scan clusters

  // for category in list of categories
  for (category in categories) {
    // set variables
    let latitudes = [];
    let longitudes = [];
    let years = categories[category][1];
    // choose between serotype or sum midpoints
    if (serotypeMidpoints) {
      calcMidpointBySerotype(latitudes, longitudes, years, categories);
    } else {
      calcMidpointSumSerotypes(latitudes, longitudes, years, categories);
    }
  }
}

// Plot a midpoint that shows midpoint of category, regardless of Serotype
function calcMidpointSumSerotypes(latitudes, longitudes, years, categories) {
  // for each year, add it to the array to combine if type is active
  for (year in years) {
    let layers = years[year]._layers;
    for (layer in layers) {
      if (layers[layer].options.options[1] * type1_active == 1) {
        latitudes.push(layers[layer]._latlng.lat);
        longitudes.push(layers[layer]._latlng.lng);
      } else if (layers[layer].options.options[2] * type2_active == 1) {
        latitudes.push(layers[layer]._latlng.lat);
        longitudes.push(layers[layer]._latlng.lng);
      } else if (layers[layer].options.options[3] * type3_active == 1) {
        latitudes.push(layers[layer]._latlng.lat);
        longitudes.push(layers[layer]._latlng.lng);
      } else if (layers[layer].options.options[4] * type4_active == 1) {
        latitudes.push(layers[layer]._latlng.lat);
        longitudes.push(layers[layer]._latlng.lng);
      }
    }
  }
  plotMidpoint(latitudes, longitudes, categories, "");
}

// Plot a midpoint that shows midpoint of category's serotype
function calcMidpointBySerotype(latitudes, longitudes, years, categories) {
  // for each year, add it to the array to combine if type is active

  function setupMidpointCalc(type, label, typeInt) {
    // If type is active
    if (type) {
      // set lat and lon to empty
      latitudes = [];
      longitudes = [];
      // for each year
      for (year in years) {
        let layers = years[year]._layers;
        for (layer in layers) {
          // if present, add lat and lon to array
          if (layers[layer].options.options[typeInt] * type == 1) {
            latitudes.push(layers[layer]._latlng.lat);
            longitudes.push(layers[layer]._latlng.lng);
          }
        }
      }
      plotMidpoint(latitudes, longitudes, categories, label);
    }
  }

  // serotype 1
  setupMidpointCalc(type1_active, "1", 1);
  // serotype 2
  setupMidpointCalc(type2_active, "2", 2);
  // serotype 3
  setupMidpointCalc(type3_active, "3", 3);
  // serotype 4
  setupMidpointCalc(type4_active, "4", 4);
}

function plotMidpoint(latitudes, longitudes, categories, additionalInfo) {
  // As long as 1 point is in the list, make a midpoint
  if (latitudes.length > 0) {
    let avg_lat = mean(latitudes);
    let avg_lng = mean(longitudes);
    // make midpoint
    let layerGroup = midpointToPointLayer(
      avg_lat,
      avg_lng,
      categories[category][3],
      categories[category][4],
      additionalInfo
    );
    categories[category][2].push(layerGroup);
    categories[category][2][categories[category][2].length - 1].addTo(map);
  }
}

// uses calculated midpoint to make a midpoint icon and add it to the map
function midpointToPointLayer(
  lat,
  lng,
  categoryLabel,
  pointColor,
  additionalInfo
) {
  let latlng = L.latLng(lat, lng);

  let size = 10;
  let anchor = 7.5;

  if (midpointMode) {
    size = 20;
    anchor = size / 2;
  }

  let midpointIcon = L.divIcon({
    html: `<svg height="${size}" width="${size}" viewBox="0 0 20 20">
  <polygon points="100,0 0,100 -100,0 0,-100" fill = "${pointColor}"
  </svg>`,
    className: "midpoint",
    iconAnchor: [size / 2, anchor],
  });

  let layer = L.marker(latlng, { icon: midpointIcon });

  //bind the popup to the circle marker
  layer.bindPopup(categoryLabel + "<br>Midpoint" + " " + additionalInfo, {
    offset: new L.Point(0, -0),
  });

  return L.layerGroup([layer]);
}

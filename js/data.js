// Americas
let category1 = {
  countryList: [
    "Anguilla",
    "Antigua and Barbuda",
    "Aruba",
    "Bahamas",
    "Barbados",
    "Virgin Islands, British",
    "Cayman Islands",
    "Cuba",
    "Dominica",
    "Dominican Republic",
    "French Antilles",
    "Grenada",
    "Haiti",
    "Jamaica",
    "Netherlands Antilles",
    "Puerto Rico",
    "St. Kitts & Nevis",
    "Saint Lucia",
    "St. Vincent & the Grenadines",
    "Trinidad and Tobago",
    "Turks & Caicos Islands",
    "Virgin Islands, U.S.",
    "Argentina",
    "Bolivia",
    "Brazil",
    "Chile",
    "Colombia",
    "Ecuador",
    "French Guiana",
    "Guyana",
    "Paraguay",
    "Peru",
    "Suriname",
    "Venezuela",
    "Belize",
    "Costa Rica",
    "El Salvador",
    "Guatemala",
    "Honduras",
    "Mexico",
    "Nicaragua",
    "Panama",
    "United States of America",
  ], // 0: country list
  dataPoints: {}, // 1: data points as a dictionary of layer groups, key representing the years
  midPoints: [], // 2: midpoint layergroup
  name: "Americas", // 3: name
  color: "#ffffff", // 4: color
  hidden: false, // 5: polyline layergroup
  allTimeEvents: { 1: 0, 2: 0, 3: 0, 4: 0 }, // 6: all time events
};
// Africa
let category2 = {
  countryList: [
    "Sudan",
    "Portugal",
    "Angola",
    "Cameroon",
    "Gabon",
    "Benin",
    "Burkina Faso",
    "Cape Verde",
    "Cote d'Ivoire",
    "Ghana",
    "Guinea",
    "Mali",
    "Nigeria",
    "Senegal",
    "Comoros",
    "Djibouti",
    "Eritrea",
    "Ethiopia",
    "Kenya",
    "Madagascar",
    "France -  Mayotte",
    "Mozambique",
    "France - Reunion",
    "Seychelles",
    "Somalia",
    "Tanzania",
  ],
  dataPoints: {},
  midPoints: [],
  name: "Africa",
  color: "#919191",
  hidden: false,
  allTimeEvents: { 1: 0, 2: 0, 3: 0, 4: 0 },
};
// Asia
let category3 = {
  countryList: [
    "Bangladesh",
    "Bhutan",
    "India",
    "Maldives",
    "Nepal",
    "Pakistan",
    "SriLanka",
    "Saudi Arabia",
    "Yemen",
    "Brunei Darussalam",
    "Cambodia",
    "Indonesia",
    "Lao PDR",
    "Malaysia",
    "Myanmar",
    "Philippines",
    "Singapore",
    "Thailand",
    "Timor-Leste",
    "Vietnam",
    "China",
    "Taiwan",
    "Japan",
  ],
  dataPoints: {},
  midPoints: [],
  name: "Asia",
  color: "#424242",
  hidden: false,
  allTimeEvents: { 1: 0, 2: 0, 3: 0, 4: 0 },
};
// Oceania
let category4 = {
  countryList: [
    "American Samoa",
    "Cook Islands",
    "French Polynesia",
    "Niue",
    "Samoa",
    "Tonga",
    "Wallis and Futuna",
    "Australia",
    "Fiji",
    "New Caledonia",
    "Papua New Guinea",
    "Solomon Islands",
    "Vanuatu",
    "Guam",
    "Kiribati",
    "Marshall Islands",
    "Micronesia, Federated States of",
    "Nauru",
    "Palau",
  ],
  dataPoints: {},
  midPoints: [],
  name: "Oceania",
  color: "#ffffff",
  hidden: false,
  allTimeEvents: { 1: 0, 2: 0, 3: 0, 4: 0 },
};

let allCategoryGroups = [category1, category2, category3, category4];
let visibleCategoryGroups = [];

let regionalMidpoints = true;
let serotypeMidpoints = false;

//Import data, add it to the map, and add sequence controls
function getData(map) {
  $.get("data/DENV_combined.csv", function (csvString) {
    // Use PapaParse to convert string to array of objects
    let data = Papa.parse(csvString, {
      header: true,
      dynamicTyping: true,
    }).data;

    // Make the dataset keys as the years to hold all datapoints for each year
    dataset = {};
    for (let i = minYear; i < maxYear + 1; i++) {
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
    updateSymbols(activeYear, (reset = true), (resetHeatmap = true));

    initiateCategoryDivs();
  });

  createSequenceControls();

  $(".range-slider").val(parseInt(activeYear));
}

// delete current points and add correct points for given year
function updateSymbols(index, reset = false, resetHeatmap = false) {
  // Set active year to index
  activeYear = index;
  visibleCategoryGroups = [];

  // Define what categories to look through
  allCategoryGroups.forEach((category) => {
    if (category.hidden == false) {
      visibleCategoryGroups.push(category);
    }
  });

  //createButton();s

  // remove points that aren't relavent
  removeUnnecessaryPoints(reset);

  // If resetHeatmap is true, recalculate all time events
  // otherwise if reset is true, construct time view

  // add correct points to objects and to map
  selectPoints();

  // calc statistics--essentially just count number of points of each serotype

  // make central point
  startMidpointCalculation();
  // for each object in each category...
  // for each leaflet marker in each category...
  // if type 1 is present && type1_active || type 2 is present and type2_active ||...
  // add lat and long to array.  Calculate average lat from array, calculate average lng from array
  // plot averages as a new point (its own leaflet point in the category list as index 2)
  // if average == undefined, don't plot.  Always remove layer from map at the start, like how map used to work.

  // Update Header
  updateHeadingContent();

  // Function to update the other 3 panels!
  calculateStats();

  if (resetHeatmap) {
    // delay .01 seconds to allow for the points to be added to the map
    calculateAllTimeEvents();
  } else {
    constructTimeView();
  }
}

// function to find years that are not relavent, and remove them from the list and clear from the map
function removeUnnecessaryPoints(reset) {
  // itterate through the list of categories
  for (category in allCategoryGroups) {
    // clear midpoints
    if (allCategoryGroups[category].midPoints.length > 0) {
      for (layer in allCategoryGroups[category].midPoints) {
        allCategoryGroups[category].midPoints[layer].clearLayers();
        delete allCategoryGroups[category].midPoints[layer];
      }
      allCategoryGroups[category].midPoints = [];
    }
    // clear midpoints trace polylines
    if (allCategoryGroups[category].lineTrace) {
      allCategoryGroups[category].lineTrace.clearLayers();
      delete allCategoryGroups[category].lineTrace;
    }

    // if reset, remove all years
    if (reset) {
      //itterate through the category dict, analyzing each year
      for (year in allCategoryGroups[category].dataPoints) {
        allCategoryGroups[category].dataPoints[year].clearLayers();
        delete allCategoryGroups[category].dataPoints[year];
      }
      // otherwise, just remove needed years
    } else {
      //itterate through the category dict, analyzing each year
      for (year in allCategoryGroups[category].dataPoints) {
        // if a key is greater than the year being looked at or less that the year being looked at, remove it
        if (year > activeYear || year < activeYear - yearDelay) {
          //remove year
          allCategoryGroups[category].dataPoints[year].clearLayers();
          delete allCategoryGroups[category].dataPoints[year];
        }
      }
    }
  }
}

//Function to layer groups that do not correspond to years in question
function selectPoints() {
  // for category in list of categories
  for (category in visibleCategoryGroups) {
    // for each year of year delay
    for (let i = 0; i <= yearDelay; i++) {
      let year = activeYear - i;
      // if that year is not in the category...
      if (!(year in visibleCategoryGroups[category].dataPoints)) {
        // get that years points, and make them a layer group
        let dataPoints = getDataPoints(
          year,
          visibleCategoryGroups[category].countryList
        );
        let points = [];
        for (item in dataPoints) {
          let row = dataPoints[item];
          let point = pointToLayer(row);
          points.push(point);
        }
        // add the generated layer group to the category object and the map
        visibleCategoryGroups[category].dataPoints[year] = L.layerGroup(points);
        if (showEventPoints) {
          visibleCategoryGroups[category].dataPoints[year].addTo(map);
        }
      }
    }
  }
}

//
function getDataPoints(year, categoryList) {
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
function startMidpointCalculation() {
  let categories;
  if (regionalMidpoints) {
    categories = visibleCategoryGroups;
  } //ELSE calculate categories based on DB scan clusters

  // for category in list of categories
  for (category in categories) {
    // set variables
    let latitudes = [];
    let longitudes = [];
    let years = categories[category].dataPoints;
    // choose between serotype or sum midpoints
    if (serotypeMidpoints) {
      // midpoint for each serotype in each category
      calcMidpointBySerotype(latitudes, longitudes, years, categories);
    } else {
      // midpoint for whole category, regardless of serotype
      calcMidpointSumSerotypes(latitudes, longitudes, years, categories);
    }
  }
}

// Plot a midpoint that shows midpoint of category, regardless of Serotype
function calcMidpointSumSerotypes(latitudes, longitudes, years, categories) {
  // tracer or sum point?
  if (midpointTrace) {
    let tracePointArray = [];
    for (year in years) {
      let layers = years[year]._layers;
      let latitudes = [];
      let longitudes = [];
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
      if (latitudes.length > 0) {
        tracePointArray.push([mean(latitudes), mean(longitudes)]);
      }
      if (year == activeYear) {
        plotMidpoint(latitudes, longitudes, categories, "");
      }
    }

    if (tracePointArray.length > 1) {
      let polyline = L.polyline(tracePointArray, {
        color: categories[category].color,
      }).arrowheads({
        fill: true,
        frequency: "70px",
        size: "7px",
        offsets: { end: "5px" },
      });
      categories[category].lineTrace = L.layerGroup([polyline]);
      categories[category].lineTrace.addTo(map);
    }
  } else {
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
}

// Plot a midpoint that shows midpoint of category's serotype
function calcMidpointBySerotype(latitudes, longitudes, years, categories) {
  traceGroup = [];
  // for each year, add it to the array to combine if type is active
  function setupMidpointCalc(type, typeInt, typeColor) {
    // If type is active
    if (type) {
      // set lat and lon to empty
      latitudes = [];
      longitudes = [];
      let tracePointArray = [];

      // for each year
      for (year in years) {
        // trace active
        if (midpointTrace /* && year != activeYear*/) {
          // reset lat and lng
          latitudes = [];
          longitudes = [];
          //continue; // skip the rest of the loop and move to the next year
          let layers = years[year]._layers;
          for (layer in layers) {
            // if present, add lat and lon to array
            if (layers[layer].options.options[typeInt] * type == 1) {
              latitudes.push(layers[layer]._latlng.lat);
              longitudes.push(layers[layer]._latlng.lng);
            }
          }
          if (latitudes.length > 0) {
            tracePointArray.push([mean(latitudes), mean(longitudes)]);
          }
        }
        // trace inactive
        else {
          let layers = years[year]._layers;
          for (layer in layers) {
            // if present, add lat and lon to array
            if (layers[layer].options.options[typeInt] * type == 1) {
              latitudes.push(layers[layer]._latlng.lat);
              longitudes.push(layers[layer]._latlng.lng);
            }
          }
        }
      }

      if (tracePointArray.length > 1) {
        let polyline = L.polyline(tracePointArray, {
          color: typeColor,
        }).arrowheads({
          fill: true,
          frequency: "90px",
          size: "7px",
          offsets: { end: "5px" },
          cursor: { hover: "default"},
        });
        traceGroup.push(polyline);
      }

      plotMidpoint(
        latitudes,
        longitudes,
        categories,
        String(typeInt),
        typeColor
      );
    }
  }

  // serotype 1
  setupMidpointCalc(type1_active, 1, type1_color);
  // serotype 2
  setupMidpointCalc(type2_active, 2, type2_color);
  // serotype 3
  setupMidpointCalc(type3_active, 3, type3_color);
  // serotype 4
  setupMidpointCalc(type4_active, 4, type4_color);

  categories[category].lineTrace = L.layerGroup(traceGroup);
  categories[category].lineTrace.addTo(map);
}

// function to plot a midpoint given a set of lat an lngs, cats
function plotMidpoint(
  latitudes,
  longitudes,
  categories,
  additionalInfo,
  typeColor
) {
  // As long as 1 point is in the list, make a midpoint
  if (latitudes.length > 0) {
    let avg_lat = mean(latitudes);
    let avg_lng = mean(longitudes);
    let color;
    if (typeColor) {
      color = typeColor;
    } else {
      color = categories[category].color;
    }
    //console.log(typeColor)
    // make midpoint
    let layerGroup = midpointToPointLayer(
      (lat = avg_lat),
      (lng = avg_lng),
      //categories[category].midPoints,
      (primaryColor = color),
      (secondaryColor = color = categories[category].color),
      (numberOfPoints = latitudes.length),
      (categoryName = categories[category]["name"])
    );
    categories[category].midPoints.push(layerGroup);
    categories[category].midPoints[
      categories[category].midPoints.length - 1
    ].addTo(map);
  }
}

// uses calculated midpoint to make a midpoint icon and add it to the map
function midpointToPointLayer(
  lat,
  lng,
  primaryColor,
  secondaryColor,
  numberOfPoints,
  categoryName
) {
  let latlng = L.latLng(lat, lng);

  let size = 12;
  let anchor = 7.5;

  if (midpointMode) {
    size = 27;
    anchor = size / 2;
  }

  let midpointIcon = L.divIcon({
    html: `<svg height="${size}" width="${size}" viewBox="0 0 20 20">
	  <polygon points="10,0 0,10 10,20 20,10" fill = "white"/>
    <polygon points="10,1 1,10 10,19 19,10" fill = "black"/>
    <polygon points="10,3 3,10 10,17 17,10" fill = "${primaryColor}"/>
    <circle cx="10" cy="10" r="3" fill="${secondaryColor}" />
    </svg>`,
    className: "midpoint",
    iconAnchor: [size / 2, anchor],
  });

  let layer = L.marker(latlng, { icon: midpointIcon });

  //bind the popup to the circle marker
  layer.bindPopup(
    categoryName +
      "<br>" +
      "Mean of <b>" +
      numberOfPoints +
      "</b> Reported Cases",
    {
      offset: new L.Point(0, -0),
    }
  );

  //bind the tooltip to the circle marker
  layer.bindTooltip(categoryName, {
    offset: new L.Point(0, -0),
  });

  return L.layerGroup([layer]);
}

/*
// function to plot a midpoint given a set of lat an lngs, cats
function plotMidpoint(
  latitudes,
  longitudes,
  categories,
  typeColor
) {
  // As long as 1 point is in the list, make a midpoint
  if (latitudes.length > 0) {
    let avg_lat = mean(latitudes);
    let avg_lng = mean(longitudes);
    let pointColor;
    if (typeColor) {
      pointColor = typeColor;
    } else {
      pointColor = categories[category].color;
    }

    console.log(typeColor)

    // make midpoint
    let layerGroup = midpointToPointLayer(
      lat = avg_lat,
      lng = avg_lng,
      primaryColor = pointColor,
      secondaryColor =(color = categories[category].color),
      numberOfPoints = latitudes.length,
      categoryName = categories[category]["name"]
    );
    categories[category].midPoints.push(layerGroup);
    categories[category].midPoints[
      categories[category].midPoints.length - 1
    ].addTo(map);
  }
}

// uses calculated midpoint to make a midpoint icon and add it to the map
function midpointToPointLayer(
  lat,
  lng,
  primaryColor,
  secondaryColor,
  numberOfPoints,
  categoryName
) {
  let latlng = L.latLng(lat, lng);

  let size = 12;
  let anchor = 7.5;

  if (midpointMode) {
    size = 27;
    anchor = size / 2;
  }

  let midpointIcon = L.divIcon({
    html: `<svg height="${size}" width="${size}" viewBox="0 0 20 20">
	  <polygon points="10,0 0,10 10,20 20,10" fill = "white"/>
    <polygon points="10,1 1,10 10,19 19,10" fill = "black"/>
    <polygon points="10,3 3,10 10,17 17,10" fill = "${primaryColor}"/>
    <circle cx="10" cy="10" r="3" fill="${secondaryColor}" />
    </svg>`,
    className: "midpoint",
    iconAnchor: [size / 2, anchor],
  });

  let layer = L.marker(latlng, { icon: midpointIcon });

  //bind the popup to the circle marker
  layer.bindPopup(categoryName + "<br>" + "Mean of <b>" + numberOfPoints + "</b> Reported Cases",  {
    offset: new L.Point(0, -0),
  });

  //bind the tooltip to the circle marker
  layer.bindTooltip(categoryName, {
    offset: new L.Point(0, -0),
  });

  return L.layerGroup([layer]);
}

*/

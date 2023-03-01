// declare map variable globally so all functions have access
let map;
// global variable of the activeLayerGroup
let activeLayerGroup;
// active year being shown global variable
let activeYear = 1943;
let yearDelay = 0;
// global variable of the dataset, an object where the keys are years
let dataset;

// ---- Main Functions ---- //

// Create the Map _ called from MAIN
function createMap() {
  // Set up initial map center and zoom level
  map = L.map("map", {
    center: [0, 0], // EDIT latitude, longitude to re-center map
    zoom: 2, // EDIT from 1 to 18 -- decrease to zoom out, increase to zoom in
  });

  // Control panel to display map layers
  let controlLayers = L.control
    .layers(null, null, {
      position: "topright",
      collapsed: true,
    })
    .addTo(map);

  // display Carto basemap tiles with light features and labels
  let light = L.tileLayer(
    "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
    {
      attribution:
        '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, &copy; <a href="https://carto.com/attribution">CARTO</a>',
    }
  ).addTo(map); // EDIT - insert or remove ".addTo(map)" before last semicolon to display by default
  controlLayers.addBaseLayer(light, "Carto Light basemap");

  // Stamen colored terrain basemap tiles with labels
  let terrain = L.tileLayer(
    "https://stamen-tiles.a.ssl.fastly.net/terrain/{z}/{x}/{y}.png",
    {
      attribution:
        'Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="http://www.openstreetmap.org/copyright">ODbL</a>.',
    }
  ); // EDIT - insert or remove ".addTo(map)" before last semicolon to display by default
  controlLayers.addBaseLayer(terrain, "Stamen Terrain basemap");

  //call getData function
  getData(map);
}

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

    // This gets all points, adds them to the layer group and
    showSelectedPoints();
  });

  createSequenceControls();
}

// Given a year, show points from that year
function showSelectedPoints() {
  let dataPoints = getDataPoints(); 
  let layers = [];
  for (i in dataPoints) {
    let row = dataPoints[i];
    let point = pointToLayer(row);
    layers.push(point);
  }
  activeLayerGroup = L.layerGroup(layers);
  activeLayerGroup.addTo(map);
}

// function to make a point based on a given row
function pointToLayer(row) {
  let typeCount = row.DEN1 + row.DEN2 + row.DEN3 + row.DEN4;
  let lat = row.Y;
  let lng = row.X;
  let latlng = L.latLng(lat, lng);

  //Create Header
  updateHeadingContent();

  //create marker options
  // !! These will be deleted upon getting effective SVG points
  let options = {
    color: "rgb(100,100,100)",
    weight: 0.5,
    opacity: 1,
    fillOpacity: 0.9,
    radius: 3,
    fillColor: "black",
  };

  options.radius = calcRadius(typeCount);
  //options.fillColor = calcColor(typeCode);
  //let layer = L.circleMarker(latlng, options); // set as circle marker

  // Below code is for making SVG poings
  // This is the lens idea.
  // Other point types in the future might be: pie chart, color-fade, stacked bars

  // Once it is figured out, the svg stuff will be moved to its own tidy function
  const svgIcon = createIcon(row.DEN1, row.DEN2, row.DEN3, row.DEN4);

  // update `numSerotypes` and `className` dynamically based on the serotypes present

  //create circle marker layer
  let layer = L.marker(latlng, { icon: svgIcon }); // set as svg

  //add formatted attribute to panel content string
  var popupContent = createPopupContent(row);
  //bind the popup to the circle marker
  layer.bindPopup(popupContent, {
    offset: new L.Point(0, -options.radius),
  });

  //return the circle marker to the L.geoJson pointToLayer option
  return layer;
}

// ---- Updating Map ---- //

// Create new sequence controls
function createSequenceControls() {
  var SequenceControl = L.Control.extend({
    options: {
      position: "bottomleft",
    },

    onAdd: function () {
      // create the control container div with a particular class name
      var container = L.DomUtil.create("div", "sequence-control-container");

      // ... initialize other DOM elements
      $(container).append('<input class="range-slider" type="range">');
      //add skip buttons
      //below Example 3.6...add step buttons
      $(container).append(
        '<button class="step" id="reverse" title="Reverse"><img src="img/left.png"></button>'
      );
      $(container).append(
        '<button class="step" id="forward" title="Forward"><img src="img/right.png"></button>'
      );

      //disable any mouse event listeners for the container
      L.DomEvent.disableClickPropagation(container);

      return container;
    },
  });

  map.addControl(new SequenceControl());

  $(".range-slider").attr({
    max: 2013,
    min: 1943,
    value: 0,
    step: 1,
  });

  $(".step").click(function () {
    //get the old index value
    var index = $(".range-slider").val();

    //Step 6: increment or decrement depending on button clicked
    if ($(this).attr("id") == "forward") {
      index++;
      //Step 7: if past the last attribute, wrap around to first attribute
      index = index > 2013 ? 1943 : index;
    } else if ($(this).attr("id") == "reverse") {
      index--;
      //Step 7: if past the first attribute, wrap around to last attribute
      index = index < 1943 ? 2013 : index;
    }

    //Step 8: update slider
    $(".range-slider").val(index);

    // update variables and visuals to show new year
    updateSymbols(index);
  });

  //Step 5: input listener for slider
  $(".range-slider").on("input", function () {
    var index = $(this).val();
    //console.log(index);
    updateSymbols(index);
  });
}

// update heading to show current year
function updateHeadingContent() {
  //add formatted attribute to panel content string
  document.getElementById("subheading").innerHTML = activeYear;
}

// delete current points and add correct points for given year
function updateSymbols(index) {
  // Set active year to index
  activeYear = index;
  activeLayerGroup.clearLayers();
  showSelectedPoints();

  // Update Header
  updateHeadingContent();
}

// ---- Designing Points ---- //

// write the string to fit in each point's popup content
function createPopupContent(row) {
  //console.log(row)

  //add country to popup content string
  let popupContent = "<p><b>" + row.COUNTR + "</b>, ";
  popupContent += "" + row.YEAR + "</p>";

  //add types observed to conent string
  popupContent += "<p> Types: <b>";
  if (row.DEN1 == 1) {
    popupContent += " 1";
  }
  if (row.DEN2 == 1) {
    popupContent += " 2";
  }
  if (row.DEN3 == 1) {
    popupContent += " 3";
  }
  if (row.DEN4 == 1) {
    popupContent += " 4";
  }
  popupContent += "</b></p>";

  popupContent += "Admin: <b>" + row.ADMIN_LEVEL + "</b>, ";
  popupContent += "N_types: <b>" + row.N_TYPES + "</b>";

  return popupContent;
}

//Once SVG is working, these two will be deleted!
//calculate the radius of each symbol
function calcRadius(typeCount) {
  let radius = typeCount + 3;
  return radius;
}

//calculate the color of each symbol
function calcColor(typeCode) {
  //Flannery Apperance Compensation formula
  let color = "rgb(255,255,255)";

  let type1 = "#e502c7";
  let type2 = "#e59102";
  let type3 = "#02e520";
  let type4 = "#0255e5";

  if (typeCode == "1000") {
    color = "#e502c7";
  }
  if (typeCode == "0100") {
    color = "#e59102";
  }
  if (typeCode == "0010") {
    color = "#02e520";
  }
  if (typeCode == "0001") {
    color = "#0255e5";
  }

  if (typeCode == "1111") {
    color = "rgb(0,0,0)";
  }

  if (typeCode == "0111") {
    color = "rgb(100,100,100)";
  }
  if (typeCode == "1011") {
    color = "rgb(100,100,100)";
  }
  if (typeCode == "1101") {
    color = "rgb(100,100,100)";
  }
  if (typeCode == "1110") {
    color = "rgb(100,100,100)";
  }
  return color;
}

function createIcon(type1, type2, type3, type4) {
  let nTypes = type1 + type2 + type3 + type4;
  let diameter = nTypes * 10;
  let slices = 100 / nTypes;

  let template = (
    color,
    proportion
  ) => `<circle r="5" cx="10" cy="10" fill = "transparent"
  stroke = "${color}"
  stroke-width="10"
  stroke-dasharray="calc(${proportion} * 31.41593 / 100) 31.41593"
  transform="rotate(-90) translate (-20)"/>`;

  let calcOrder = (type) => {
    let order = nTypes;
    if (type4) {
      if (type == 4) {
        return order
      }
      order -= 1
    }
    if (type3) {
      if (type == 3) {
        return order
      }
      order -= 1
    }
    if (type2) {
      if (type == 2) {
        return order
      }
      order -= 1
    }
    if (type1) {
      if (type == 1) {
        return order
      }
      order -= 1
    }
    return order;
  }

  let slice_type4 = template("#ba3aa9", slices * type4 * calcOrder(4));
  let slice_type3 = template("#e07f00", slices * type3 * calcOrder(3));
  let slice_type2 = template("#3dd417", slices * type2 * calcOrder(2));
  let slice_type1 = template("#03a8a0", slices * type1 * calcOrder(1));

  icon = L.divIcon({
    html: `<svg height="${diameter}" width="${diameter}" viewBox="0 0 20 20"
    >
    
    ${slice_type4}
    ${slice_type3}
    ${slice_type2}
    ${slice_type1}
    
    
    
    </svg>`,
    className: "serotype",
    iconAnchor: [diameter / 2, diameter / 2],
  });

  return icon;
}

function getDataPoints() {
  let totalPoints = [];
  for (let i = 0; i <= yearDelay; i++) {
    let tempPoints = dataset[activeYear - i]
    if (tempPoints != undefined) {
      totalPoints = totalPoints.concat(tempPoints)
    }
  }
  let dataPoints = dataset[activeYear];
  let dataPoints2 = dataset[activeYear - 1];
  //let totalPoints = dataPoints.concat(dataPoints2)
  //console.log(dataPoints)
  return totalPoints
}


// function to set a new year based on typing and submitting a new year
function submit_YearDelay() {
  var inputString = document.getElementById("input_yearDelay").value;
  var inputInt = parseInt(inputString)
  if ((inputInt <= 70) && (inputInt >= 0)) {
      document.getElementById("input_yearDelay").value = ""
      document.getElementById("current_yearDelay").innerHTML = inputString
      yearDelay = inputInt;
      updateSymbols(activeYear);
  }
  else {
      alert("Not in range 0-70")
  }
}



// ---- _MAIN_ ---- //
$(document).ready(createMap);

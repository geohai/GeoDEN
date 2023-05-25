// declare map variable globally so all functions have access
let map;

// active year being shown global variable
let activeYear = 1988;
let yearDelay = 0;
// global variable of the activeLayerGroup
let activeLayerGroup;
let activeLayerGroups = [];
// global variable of the dataset, an object where the keys are years
let dataset;

const type1_color = "#D4B100";
const type2_color = "#B32D9D";
const type3_color = "#21BEE6";
const type4_color = "#26670A";

// ---- Main Functions ---- //

// Create the Map _ called from MAIN
function createMap() {
  // Set up initial map center and zoom level
  map = L.map("map", {
    center: [-10, 37], // EDIT latitude, longitude to re-center map
    zoom: 2, // EDIT from 1 to 18 -- decrease to zoom out, increase to zoom in
    minZoom: 2,
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
  ); // EDIT - insert or remove ".addTo(map)" before last semicolon to display by default
  controlLayers.addBaseLayer(light, "Light");

  // Stamen colored terrain basemap tiles with labels
  let dark = L.tileLayer(
    "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
    {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    }
  ).addTo(map); // EDIT - insert or remove ".addTo(map)" before last semicolon to display by default
  controlLayers.addBaseLayer(dark, "Dark");

  //call getData function
  getData(map);
}

// function to make a point based on a given row
function pointToLayer(row) {
  let typeCount = row.DEN1 + row.DEN2 + row.DEN3 + row.DEN4;
  let lat = row.Y;
  let lng = row.X;
  let latlng = L.latLng(lat, lng);

  //Create Header
  updateHeadingContent();

  // Once it is figured out, the svg stuff will be moved to its own tidy function
  const svgIcon = createIcon(row.DEN1, row.DEN2, row.DEN3, row.DEN4);

  // update `numSerotypes` and `className` dynamically based on the serotypes present

  //create circle marker layer
  let layer = L.marker(latlng, {
    icon: svgIcon,
    options: {
      // store the values of each serotype
      1: row.DEN1,
      2: row.DEN2,
      3: row.DEN3,
      4: row.DEN4,
    },
  }); // set as svg

  //add formatted attribute to panel content string
  var popupContent = createPopupContent(row);
  //bind the popup to the circle marker
  layer.bindPopup(popupContent, {
    offset: new L.Point(0, -0),
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
      var container = L.DomUtil.create("div");

      $("#timeControls").append(
        '<button class="icon-button step" id="reverse" title="Previous Year"><img src="img/arrow_left.svg"></button>'
      );
      
      // ... initialize other DOM elements
      $("#timeControls").append('<input class="range-slider" type="range" title="Timeline"> ');
      //add skip buttons
      //below Example 3.6...add step buttons

      $("#timeControls").append(
        '<button class="icon-button step" id="forward" title="Next Year"><img src="img/arrow_right.svg"></button>'
      );

      //disable any mouse event listeners for the container
      //L.DomEvent.disableClickPropagation(container);

      return container;
    },
  });

  map.addControl(new SequenceControl());

  $(".range-slider").attr({
    max: 2020,
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
      index = index > 2020 ? 1943 : index;
    } else if ($(this).attr("id") == "reverse") {
      index--;
      //Step 7: if past the first attribute, wrap around to last attribute
      index = index < 1943 ? 2020 : index;
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
  document.getElementById("year").placeholder = activeYear;
  if (activeYear > 2013) {
    document.getElementById("dataWarning").classList.toggle("yearWarn", true);
  } else {
    document.getElementById("dataWarning").classList.toggle("yearWarn", false);
  }
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
  popupContent += "</br>X,Y: " + row.X + ", " + row.Y;

  return popupContent;
}

//Function to create a new icon (pie chart symbol)
function createIcon(type1, type2, type3, type4, label = false) {
  // First, define nTypes and diameter
  let nTypes =
    type1 * type1_active +
    type2 * type2_active +
    type3 * type3_active +
    type4 * type4_active;
  let diameter = 0;
  if (nTypes > 0) {
    diameter = (nTypes + 0.5) * 7;
  }

  // if midpoint mode and at least 1 serotype present, set diameter differently
  if (midpointMode) {
    if (nTypes > 0) {
      diameter = (nTypes + 0.5) * 3;
    }
  }

  // if its a label, define nTypes and diameter differently
  if (label == true) {
    nTypes = type1 + type2 + type3 + type4;
    diameter = (nTypes + 2) * 2.5;
  }

  // slices just represents what percentage each slice should be
  let slices = 100 / nTypes;

  // Function to create an svg template based on color and proportion
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
    if (type4 && (type4_active || label)) {
      if (type == 4) {
        return order;
      }
      order -= 1;
    }
    if (type3 && (type3_active || label)) {
      if (type == 3) {
        return order;
      }
      order -= 1;
    }
    if (type2 && (type2_active || label)) {
      if (type == 2) {
        return order;
      }
      order -= 1;
    }
    if (type1 && (type1_active || label)) {
      if (type == 1) {
        return order;
      }
      order -= 1;
    }
    return order;
  };

  let slice_type4 = template(type4_color, slices * type4 * calcOrder(4));
  let slice_type3 = template(type3_color, slices * type3 * calcOrder(3));
  let slice_type2 = template(type2_color, slices * type2 * calcOrder(2));
  let slice_type1 = template(type1_color, slices * type1 * calcOrder(1));

  let offset = (nTypes) => {
    if (nTypes == 1) {
      if (midpointMode) {
        return diameter / 2 + 6;
      } else {
        return diameter / 2;
      }
    }
    if (nTypes == 2) {
      return 1;
    }
    if (nTypes == 3) {
      if (midpointMode) {
        return diameter / 2 + 3;
      } else {
        return diameter / 2;
      }
    }
    if (nTypes == 4) {
      return diameter / 2;
    }
  };

  icon = L.divIcon({
    html: `<svg height="${diameter}" width="${diameter}" viewBox="0 0 20 20"
    >
    
    ${slice_type4}
    ${slice_type3}
    ${slice_type2}
    ${slice_type1}
    
    
    
    </svg>`,
    className: "serotype",
    iconAnchor: [diameter / 2, offset(nTypes)],
  });

  return icon;
}

// ---- _MAIN_ ---- //
$(document).ready(createMap);

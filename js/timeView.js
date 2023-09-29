let HeatmapScale = 0.5;
let heatmapMinYear = minYear;
let heatmapMaxYear = maxYear;

// Function to make a heatmap for a given category
function constructHeatMap(
  data,
  categories,
  categoryIndex,
  MaxValue,
  categoryName
) {
  // -- Define Variables -- //
  // Get the container for the heatmap
  const heatmapContainer = document.querySelector(
    "#heatmapContainer" + categoryName
  );

  // Left and right sides of the heatmap
  const leftBounds = heatmapContainer.getBoundingClientRect().left;
  const rightBounds = heatmapContainer.getBoundingClientRect().right;

  // -- Check to see if we need to do this -- //
  // Don't make a heatmap if there are no active categories
  if (type1_active + type2_active + type3_active + type4_active === 0) {
    return;
  }

  // -- Define Functions -- //
  // Function to filter the data
  function filterData(data) {
    const activeTypes = {
      1: type1_active,
      2: type2_active,
      3: type3_active,
      4: type4_active,
    };

    // Iterate through every object(year) in the data
    new_data = {};
    for (let year in data) {
      // If the year is outside the range, skip it
      if (year < heatmapMinYear || year > heatmapMaxYear) {
        continue;
      }
      // Add the year to the new data
      new_data[year] = {};
      // For each type in the year, check if it is active
      for (let type in data[year]) {
        if (activeTypes[type] == false) {
          continue;
        }
        // Add the active type and its value to new_data
        new_data[year][type] = data[year][type];
      }
    }
    return new_data;
  }

  // Function to draw the heatmap
  function drawHeatmap() {
    //console.log(heatmapContainer)
    // Get the width and height of the heatmap container
    const heatmapWidth = heatmapContainer.offsetWidth;
    const heatmapHeight = heatmapContainer.offsetHeight;

    // append the svg object to the heatmapContainer div
    const heatmapSVG = d3
      .select("#heatmapContainer" + categoryName)
      .append("svg")
      .attr("class", "heatmapSVG");

    // Get filtered years
    const heatmapYears = Object.keys(filteredData);

    // Get filtered types
    const heatmapTypes = Object.keys(filteredData[heatmapYears[0]]).reverse();

    // Build X scales and axis:
    const x = d3
      .scaleBand()
      .range([0, heatmapWidth])
      .domain(heatmapYears)
      .paddingInner(0)
      .paddingOuter(0)
      .round(false);

    // Build Y scales and axis:
    const y = d3
      .scaleBand()
      .range([heatmapHeight, 0])
      .domain(heatmapTypes)
      .paddingInner(0)
      .paddingOuter(0)
      .round(true);

    // Build color scales
    const startingColor = "hsl(0, 0%, 7%)";
    const colorPowerCoeffiecient = 0.45;
    const colorScales = {
      // Set up scales after doing tool tips
      col1: d3
        .scaleSequential((t) =>
          d3.interpolate(
            startingColor,
            type1_color
          )(Math.pow(t, colorPowerCoeffiecient))
        )
        .domain([0, MaxValue]),

      col2: d3
        .scaleSequential((t) =>
          d3.interpolate(
            startingColor,
            type2_color
          )(Math.pow(t, colorPowerCoeffiecient))
        )
        .domain([0, MaxValue]),

      col3: d3
        .scaleSequential((t) =>
          d3.interpolate(
            startingColor,
            type3_color
          )(Math.pow(t, colorPowerCoeffiecient))
        )
        .domain([0, MaxValue]),

      col4: d3
        .scaleSequential((t) =>
          d3.interpolate(
            startingColor,
            type4_color
          )(Math.pow(t, colorPowerCoeffiecient))
        )
        .domain([0, MaxValue]),
    };

    // Select the toolbar and sub elements
    const toolbar = d3.select("#heatmapToolbar");
    const casesTip = d3.select("#heatmapTool_cases");
    const yearTip = d3.select("#heatmapTool_year");
    const serotypeTip = d3.select("#heatmapTool_serotype");
    const serotypeTipNum = d3.select("#heatmapTool_serotypeNum");
    const categoryTip = d3.select("#heatmapTool_category");
    // Select the tooltip and sub elements
    const tooltip = d3.select("#heatmapTooltip");
    const tooltipCases = d3.select("#heatmapTip_cases");
    const tooltipYear = d3.select("#heatmapTip_year");

    let tooltipX = 0;
    let tooltipY = 0;
    let yearHovered = 0;

    let isDragging = false; // Flag to indicate if the user is dragging the heatmap

    // Three functions that change the tooltip when the user hovers/moves/leaves a cell
    const mouseover = function (event, d) {
      // if mouse down is false, show the tooltip
      if (!(event.buttons == 1)) {
        toolbar.classed("inactive", false).classed("active", true); // Toggle classes
        serotypeTip.classed("t" + d.type, true);
        tooltip.classed("inactive", false).classed("active", true);
        tooltipCases.classed("t" + d.type, true);
        d3.select(this)
          .style("stroke", "white")
          .style("stroke-width", "1px")
          .attr("width", x.bandwidth())
          .attr("height", y.bandwidth());
        const rectBounds = this.getBoundingClientRect(); // Get the bounding rectangle of the hovered rectangle
        tooltipX = (rectBounds.left + rectBounds.right) / 2; // Set tooltipX to the left coordinate of the rectangle
        tooltipY = rectBounds.top; // Set tooltipY to the top coordinate of the rectangle
        //console.log(rectBounds)
      }
    };

    const mousemove = function (event, d) {
      if (!(event.buttons == 1)) {
        casesTip.html("Reports: <b>" + d.value + "</b>");
        yearTip.html("<b>" + d.year + "</b>");
        serotypeTip.html(
          "Serotype <b id='heatmapTool_serotypeNum'>" + d.type + "</b>"
        );
        categoryTip.html("<b>" + categoryName + "</b>");
        tooltipCases.html(d.value);
        tooltipYear.html(d.year);
        //console.log(event)
        // set tooltip position relative to mouse
        tooltip.style("left", tooltipX + "px");
        tooltip.style("top", tooltipY + "px");
      }
    };

    const mouseleave = function (d) {
      toolbar.classed("active", false).classed("inactive", true); // Toggle classes
      tooltip.classed("active", false).classed("inactive", true);
      casesTip.html("Reports");
      yearTip.html("Year");
      serotypeTip.html("Serotype");
      categoryTip.html("Category");
      serotypeTip.classed("t1", false);
      serotypeTip.classed("t2", false);
      serotypeTip.classed("t3", false);
      serotypeTip.classed("t4", false);
      tooltipCases.classed("t1", false);
      tooltipCases.classed("t2", false);
      tooltipCases.classed("t3", false);
      tooltipCases.classed("t4", false);
      d3.select(this)
        .style("stroke", "none")
        .attr("width", x.bandwidth() + 1)
        .attr("height", y.bandwidth() + 1);
    };

    // Function to highlight the active year with an overlay outline
    function highlightYear(year) {
      if (timeRange[1] < heatmapMinYear || timeRange[0] > heatmapMaxYear) {
        return;
      }

      //console.log(timeRange)
      const startYear =
        timeRange[0] > heatmapMinYear ? timeRange[0] : heatmapMinYear;
      const endYear =
        timeRange[1] < heatmapMaxYear ? timeRange[1] : heatmapMaxYear;

      // Add the overlay
      const overlay = heatmapSVG
        .append("rect")
        .attr("class", "heatmapOverlay")
        .attr("x", x(startYear))
        .attr("y", 0)
        .attr("width", x.bandwidth() * (endYear - startYear + 1))
        .attr("height", heatmapHeight)
        .style("fill", "none")
        .style("stroke", "hsl(0, 0%, 75%)")
        .attr("pointer-events", "none")
        .style("stroke-width", "2px");

      // Add left handle for year delay
      const leftHandle = heatmapSVG
        .append("rect")
        .attr("class", "handle")
        .attr("x", x(timeRange[0]) - 2.5) // Adjust the position as needed
        .attr("y", 0)
        .attr("width", 7)
        .attr("height", heatmapHeight)
        .style("fill", "rgba(0, 0, 0, 0)") // Transparent fill
        .style("cursor", "ew-resize");

      // Add right handle for active year
      const rightHandle = heatmapSVG
        .append("rect")
        .attr("class", "handle")
        .attr("x", x(timeRange[1]) + x.bandwidth() - 2.5) // Adjust the position as needed
        .attr("y", 0)
        .attr("width", 7)
        .attr("height", heatmapHeight)
        .style("fill", "rgba(0, 0, 0, 0)") // Transparent fill
        .style("cursor", "ew-resize");

      rightHandle.call(
        d3.drag()
        .on("start", function () {
          rightHandle.style("fill", "white"); // Change fill to white on drag start
        })
        .on("drag", function () {
          rightHandle.style("fill", "white");
          const xPosition = event.x;

          const cellIndex = Math.floor(
            (xPosition - leftBounds - (x.bandwidth() * .5)) / x.bandwidth()
          );
          let newYear = cellIndex + parseInt(heatmapMinYear);

          // Update active year based on the drag position
          // Adjust the calculations according to your specific requirements
          //let newYear = Math.floor(xPosition / x.bandwidth());

          if (newYear < parseInt(heatmapMinYear)) {
            newYear = parseInt(heatmapMinYear);
          } else if (newYear > parseInt(heatmapMaxYear)) {
            newYear = parseInt(heatmapMaxYear);
          }

          activeYear = newYear;
          // wait .3 seconds before updating the symbols
          setTimeout(function () {
            if (newYear == activeYear) {
              updateSymbols(activeYear);
            }
          }, 0.5);
          // ...
        })
        .on("end", function () {
          console.log("end")
          rightHandle.style("fill", "white");
          //rightHandle.style("fill", "rgba(255, 255, 255, 0.5)"); // Reset fill on drag end
        })
      );

      leftHandle.call(
        d3.drag()
        .on("start", function () {
          leftHandle.style("fill", "white"); // Change fill to white on drag start
        })
        .on("drag", function () {
          const xPosition = event.x;

          const cellIndex = Math.floor(
            ((xPosition - leftBounds + (x.bandwidth() * .5)) / x.bandwidth())
          );
          let newInterval = activeYear - (cellIndex + parseInt(heatmapMinYear));

          if (newInterval < 0) {
            newInterval = 0;
          } else if (newInterval > activeYear - parseInt(heatmapMinYear)) {
            newInterval = activeYear - parseInt(heatmapMinYear);
          }

          yearDelay = newInterval;
          // wait .3 seconds before updating the symbols
          setTimeout(function () {
            if (newInterval == yearDelay) {
              updateSymbols(activeYear);
            }
          }, 0.5);
        })
      );
    }

    // -- Draw Heatmap -- //
    // Add the squares
    heatmapSVG
      .selectAll()
      .data(Object.entries(filteredData))
      .enter()
      .selectAll("rect")
      .data(function (d) {
        //console.log(d)
        const year = d[0];
        const values = d[1];
        // For each type key in the values, return an object with the year, type, and value
        return Object.entries(values).map(function ([type, value]) {
          return {
            year: year,
            type: parseInt(type),
            value: value,
          };
        });
      })
      .enter()
      .append("rect")
      .attr("x", function (d) {
        return x(d.year);
      })
      .attr("y", function (d) {
        return y(d.type);
      })
      .attr("width", x.bandwidth() + 1)
      .attr("height", y.bandwidth() + 1)
      .style("fill", function (d) {
        const value = d.value;
        const type = d.type;
        if (type === 1) {
          return colorScales.col1(value);
        } else if (type === 2) {
          return colorScales.col2(value);
        } else if (type === 3) {
          return colorScales.col3(value);
        } else if (type === 4) {
          return colorScales.col4(value);
        }
      })
      .on("mouseover", mouseover)
      .on("mousemove", mousemove)
      .on("mouseleave", mouseleave)
      .on("mousedown", function (event, d) {
        updateSymbols(d.year);
        $(".range-slider").val(d.year);
      })
      .on("click", highlightYear(1967));
  }

  // -- Call Functions -- //
  const filteredData = filterData(data);
  drawHeatmap();
}

// Construct the time view panel by creating a heatmap for each visible category
function constructTimeView() {
  // For each visible category, construct a heatmap
  const categoryCount = visibleCategoryGroups.length;

  r.style.setProperty("--SectionHeight", "calc(90% / " + categoryCount + ")");

  // -- Define Variables -- //
  // Get the container for the heatmap
  const heatmapContainer = document.querySelector("#heatmapGeneralContainer");

  // Clear the container of any existing heatmaps
  heatmapContainer.innerHTML = "";

  // Get max value for color scale
  const getMaxValue = () => {
    let maxValue = 0;
    const activeTypes = {
      1: type1_active,
      2: type2_active,
      3: type3_active,
      4: type4_active,
    };
    for (let i = 0; i < categoryCount; i++) {
      for (let j = heatmapMinYear; j < heatmapMaxYear; j++) {
        for (let k = 1; k < 5; k++) {
          if (activeTypes[k]) {
            if (visibleCategoryGroups[i].allTimeEvents[j] !== undefined) {
              if (visibleCategoryGroups[i].allTimeEvents[j][k] > maxValue) {
                maxValue = visibleCategoryGroups[i].allTimeEvents[j][k];
              }
            }
          }
        }
      }
    }
    if (maxValue == 0) {
      maxValue = 1;
    }
    return maxValue;
  };

  const maxValue = getMaxValue();

  // For each category, create the div
  for (let i = 0; i < categoryCount; i++) {
    // Create a div for the category with the class: heatmapSection and the id: heatmapSection + category name
    const category = visibleCategoryGroups[i];
    const categoryDiv = document.createElement("div");
    const categoryTitle = "heatmapSection" + category.name;
    categoryDiv.classList.add("heatmapSection");
    //console.log(categoryTitle);
    categoryDiv.id = categoryTitle;
    heatmapContainer.appendChild(categoryDiv);

    // Create a title for the category
    const titleDiv = document.createElement("div");
    titleDiv.classList.add("heatmapTitle");
    titleDiv.textContent = category.name; // Set the title text content
    // Append the titleDiv to the categoryDiv
    categoryDiv.appendChild(titleDiv);

    // Create a heatmap container for the category
    const containerDiv = document.createElement("div");
    containerDiv.classList.add("heatmapContainer");
    containerDiv.id = "heatmapContainer" + category.name;
    // Append the titleDiv to the categoryDiv
    categoryDiv.appendChild(containerDiv);

    //console.log(category, i);
    // Make the heatmap
    constructHeatMap(
      (data = category.allTimeEvents),
      (categories = categoryCount),
      (categoryIndex = i),
      (MaxValue = maxValue),
      (categoryName = category.name)
    );
  }
}

// Calculate all time stats for each category
function calculateAllTimeEvents() {
  // Set each categories allTimeEvents to the base structure
  for (category in allCategoryGroups) {
    allCategoryGroups[category].allTimeEvents = {};
    for (let i = minYear; i <= maxYear; i++) {
      allCategoryGroups[category].allTimeEvents[i] = { 1: 0, 2: 0, 3: 0, 4: 0 };
    }
  }

  // Get data for each year
  for (year in dataset) {
    for (report in dataset[year]) {
      for (category in allCategoryGroups) {
        if (
          allCategoryGroups[category].countryList.includes(
            dataset[year][report].COUNTR
          )
        ) {
          // For each type of Dengue Fever
          allCategoryGroups[category].allTimeEvents[year][1] +=
            dataset[year][report].DEN1;
          allCategoryGroups[category].allTimeEvents[year][2] +=
            dataset[year][report].DEN2;
          allCategoryGroups[category].allTimeEvents[year][3] +=
            dataset[year][report].DEN3;
          allCategoryGroups[category].allTimeEvents[year][4] +=
            dataset[year][report].DEN4;
        }
      }
    }
  }

  constructTimeView();
}

// -- Event Listeners -- //

// Event listener for the year inputs

$(document).ready(function () {
  // Add event listeners to the input elements
  $(".heatmapYearInput").on("change", function () {
    // Get the updated values from the input elements
    heatmapMinYear = $("#heatmapMinInput").val();
    heatmapMaxYear = $("#heatmapMaxInput").val();

    // Update the max attribute of the min input based on the max input's value
    $("#heatmapMinInput").attr("max", heatmapMaxYear);
    const minInput = $("#heatmapMinInput").attr("max", heatmapMaxYear);

    // Update the min attribute of the max input based on the min input's value
    $("#heatmapMaxInput").attr("min", heatmapMinYear);
    const maxInput = $("#heatmapMaxInput").attr("min", heatmapMinYear);

    if (heatmapMinYear < minYear) {
      $("#heatmapMinInput").val(minYear);
    }
    if (heatmapMaxYear > maxYear) {
      $("#heatmapMaxInput").val(maxYear);
    }

    // FIX THESE
    // The idea is to keep the user from being able to put in a value that is too low or too high
    if (heatmapMinYear > minInput) {
      //console.log("minInput: " + minInput)
      $("#heatmapMinInput").val(minYear);
    }
    if (heatmapMaxYear > maxInput) {
      //console.log("maxInput: " + maxInput)
      $("#heatmapMaxInput").val(maxInput);
    }

    constructTimeView();
  });
});

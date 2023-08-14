// chartContainer is just a variable to hold the div chart container, which should be used to place and show the 5 horizontal bar charts
const chartContainer = d3.select("#chart_container");

// Create an activeData variable, so store data for our 5 variables of interest.  Each starts as count 0 to wait for statsMap to be created and store the actual information.
let activeData = [
  {
    types: 1,
  },
  {
    types: 2,
  },
  {
    types: 3,
  },
  {
    types: 4,
  },
  {
    types: 1234,
  },
];

let addPresent = false;

// -- UTILITY FUNCTIONS -- // these are little functions that can be reused anywhere

// sort numbers in a string--this is a utitly function
function sortNumbersInString(numbersString) {
  return numbersString.split("").sort().join("");
}

function removeChart(dataObj) {
  // get index of dataObj
  const index = activeData.indexOf(dataObj);
  // Transition to remove the chart
  dataObj.chart
    .transition()
    .duration(200)
    .attr("transform", "translate(" + -40 + ", 0)")
    .style("opacity", 0)
    .remove();
  // remove that item from activeData array
  activeData.splice(index, 1);
  return;
}

// -- MAIN FUNCTIONS -- //

// This function creates a chart, given an object with 'types'
function constructChart(dataObj) {
  // Make the tab label symbol which represents which types are importnatn
  const svgsymbol = createIcon(
    dataObj.types.toString().includes("1") ? 1 : 0,
    dataObj.types.toString().includes("2") ? 1 : 0,
    dataObj.types.toString().includes("3") ? 1 : 0,
    dataObj.types.toString().includes("4") ? 1 : 0,
    (label = true)
  );

  //console.log(svgsymbol.options.html);

  // set the width and height of each chart
  const width = chartContainer.node().getBoundingClientRect().width;
  const barWidth = width;
  const height = 30;
  const barHeight = 10;

  // create a new svg element for each chart
  const chart = chartContainer
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  // create the background bar with 100% width
  chart
    .append("rect")
    .attr("class", "bar_backdrop")
    .attr("x", 30)
    .attr("y", (height - (barHeight + 5)) / 2)
    .attr("width", barWidth)
    .attr("height", barHeight + 5)
    .attr("fill", "rgba(20,20,20,.3)");

  // create the initial bar with 0% width
  chart
    .append("rect")
    .attr("class", "bar")
    .attr("x", 40)
    .attr("y", (height - barHeight) / 2)
    .attr("width", 0)
    .attr("height", barHeight)
    .attr("fill", "white");

  // add the count label to the right of the bar
  chart
    .append("text")
    .attr("class", "count-label")
    .attr("x", barWidth)
    .attr("y", height / 2 + 5)
    .attr("text-anchor", "end")
    .style("fill", "rgb(159, 159, 159)") // Set the text color to red
    .style("font-size", ".8rem") // Set the font size to 12 pixels
    .style("z-index", "0")
    //.style("font-family", "Arial") // Set the font family to Arial
    .text(dataObj.count);

  // add the type button to the left of the bar
  const typeButton = chart
    .append("foreignObject")
    .attr("class", "type-label")
    .attr("width", 400)
    .attr("height", 200)
    .attr("x", 0)
    .attr("y", -7.5)
    .append("xhtml:body")
    .html(
      `<button class="tab_label">${svgsymbol.options.html}      
        <span class="tooltip tablabel">
          <div class="buttonHolder">        
            <!--Type 1-->
              <button class="button typeTool serotypeSwitch_1 ${
                dataObj.types.toString().includes("1")
                  ? "active-button"
                  : "inactive-button"
              }">1</button>
            <!--Type 2-->
              <button class="button typeTool serotypeSwitch_2 ${
                dataObj.types.toString().includes("2")
                  ? "active-button"
                  : "inactive-button"
              }">2</button>
            <!--Type 3-->
              <button class="button typeTool serotypeSwitch_3 ${
                dataObj.types.toString().includes("3")
                  ? "active-button"
                  : "inactive-button"
              }">3</button>
            <!--Type 4-->
              <button class="button typeTool serotypeSwitch_4 ${
                dataObj.types.toString().includes("4")
                  ? "active-button"
                  : "inactive-button"
              }">4</button>
            <!--Trash-->
              <button class="button typeTool barTrashIcon">
              <img src="img/trash.svg" alt="Remove Chart"></button>
            </div>
        </span>
      </button>`
    );

    /*
  const trashIcon = chart.select(".barTrashIcon");
  trashIcon.on("click", function () {
    console.log("trash clicked");
    removeChart(dataObj);
  });*/

  // Tab Interaction Events!
  typeButton
    .select("button")
    .on("mousedown", function () {
      //console.log("mouse down on tab");
    })
    .on("mouseover", function () {
      // Show the tooltip
      const tooltip = chart.select(".tooltip");
      tooltip
        .style("visibility", "visible")
        .style("opacity", 1)
        .style("width", "7rem");

      // Show the tooltip buttons
      const tooltipButtons = chart.selectAll(".button.typeTool");
      tooltipButtons
        .style("visibility", "visible")
        .style("opacity", 1)
        .style("width", "1.3rem")
        .style("left", ".5rem");
      tooltipButtons.on("mouseover", function () {
        // on hover the buttons,  keep the whole tooltip visible
        tooltip
          .style("visibility", "visible")
          .style("opacity", 1)
          .style("width", "7rem");
        tooltipButtons
          .style("visibility", "visible")
          .style("opacity", 1)
          .style("width", "1.3rem")
          .style("left", ".5rem");

        tooltipButtons.on("click", function () {
          //console.log(dataObj.types)
          //console.log(this.innerHTML);
          // if the innerHTML is not a number (1-4), then it must be the trash icon.  Remove the chart
          if (this.innerHTML!= "1" && this.innerHTML != "2" && this.innerHTML != "3" && this.innerHTML != "4") {
            removeChart(dataObj);
            return;
          };
          if (dataObj.types.toString().includes(this.innerHTML)) {
            dataObj.types = parseInt(
              sortNumbersInString(
                dataObj.types.toString().replace(this.innerHTML, "")
              )
            );
            if (!dataObj.types) {
              removeChart(dataObj);
            }
          } else {
            dataObj.types = parseInt(
              sortNumbersInString(dataObj.types + this.innerHTML)
            );
          }
          //console.log(dataObj.types)
          updateChart();
        });
      });
      tooltipButtons.on("mouseout", function () {
        // on hover the buttons,  keep the whole tooltip visible
        tooltip
          .style("visibility", "visible")
          .style("opacity", 1)
          .style("width", "7rem");
        tooltipButtons
          .style("visibility", "visible")
          .style("opacity", 1)
          .style("width", "1.3rem")
          .style("left", ".5rem");
      });
    })
    .on("mouseout", function () {
      // Hide the tooltip
      const tooltip = chart.select(".tooltip");
      tooltip
        .style("visibility", "hidden")
        .style("opacity", 0)
        .style("width", ".5rem");

      // Hide the tooltip buttons
      const tooltipButtons = chart.selectAll(".button.typeTool");
      tooltipButtons
        .style("visibility", "hidden")
        .style("opacity", 0)
        .style("width", ".9rem")
        .style("left", "0rem");
    })
    .on("dblclick", function () {
      removeChart(dataObj);
    });

  dataObj.chart = chart;

  setTimeout(() => {
    updateChart();
  }, 100);
}

// updateChart updates the whole chart panel every time there is new data
function updateChart() {
  if (activeData.length === 0) {
    chartContainer.selectAll("*").remove();
    return;
  }
  // upon updateChart being called, the activeData variable is updated
  activeData.forEach((dataObj) => {
    activeVars = dataObj.types;
    dataObj.count = statsMap["c" + activeVars];
    //console.log(statsMap["c" + activeVars])
  });

  // The rest is the actual updating of each chart.  I put it all in a set timeout to make sure the data comes back from the above loop before it starts
  setTimeout(() => {
    // create a new chart for each object in activeData
    activeData.forEach((dataObj) => {
      // set the width and height of each chart
      const width = chartContainer.node().getBoundingClientRect().width;
      const barWidth = width - 70;
      const events = statsMap.events === 0 ? 0 : statsMap.events;
      const adjWidth =
        statsMap.events === 0 ? 0 : barWidth * (dataObj.count / events);

      // update the bar width and count label to match the dataObj count value
      dataObj.chart
        .selectAll(".bar_backdrop")
        .transition()
        .duration(200)
        .attr("width", barWidth + 13);
      dataObj.chart
        .selectAll(".bar")
        .transition()
        .duration(200)
        .attr("width", adjWidth);
      dataObj.chart
        .selectAll(".count-label")
        .transition()
        .duration(200)
        // this .att sets the position of the label, as defined by the number of digits in the label
        .attr("x", adjWidth + (dataObj.count.toString().length + 5) * 9)
        .text(dataObj.count);

      // Update the SVG symbol in the .tab_label button
      let svgsymbol = createIcon(
        dataObj.types.toString().includes("1") ? 1 : 0,
        dataObj.types.toString().includes("2") ? 1 : 0,
        dataObj.types.toString().includes("3") ? 1 : 0,
        dataObj.types.toString().includes("4") ? 1 : 0,
        (label = true)
      );
      const tabLabel = dataObj.chart.select(".tab_label svg");
      tabLabel.html(svgsymbol.options.html);
      // Set explicit width and height for the SVG element
      const symbolWidth = 25; // Adjust the desired width
      const symbolHeight = 25; // Adjust the desired height
      const nTypes = dataObj.types.toString().length; // Adjust the desired height
      const sideShift =
        nTypes === 1
          ? 0.55
          : nTypes === 2
          ? 0.45
          : nTypes === 3
          ? 0.35
          : nTypes === 4
          ? 0.25
          : undefined;
      tabLabel
        .style("position", "absolute")
        .style("left", sideShift + "rem")
        .style("top", sideShift + "rem")
        .attr("width", symbolWidth)
        .attr("height", symbolHeight);

      // Update the classes of each typeTool button
      for (let i = 1; i <= 4; i++) {
        const button = dataObj.chart.select(`.serotypeSwitch_${i}`);
        const isActive = dataObj.types.toString().includes(i.toString());
        button.classed("active-button", isActive);
        button.classed("inactive-button", !isActive);
      }
    });
  }, 50);

  // use something like this to remove specific charts
  // chartContainer.selectAll("*").remove();
}

// This function adds the starting charts and is where any other chart code should go that should just be ran on start
function initiateCharts() {
  // construct chart for each row of data
  activeData.forEach((dataObj) => {
    constructChart(dataObj);
  });

  createButton();
}

// This function creates the add chart button.  It sets up interaction as well.
function createButton() {
  addPresent = true;

  // Create a button below the last chart
  const buttonDiv = chartContainer.append("div").attr("class", "button-div");

  // Append a button element to the button container
  buttonDiv
    .append("button")
    .attr("id", "addChart")
    .attr("class", "icon-button")
    .append("img")
    .attr("src", "img/cross.svg");

  // Add an event listener to the button
  buttonDiv.select("button").on("click", function () {
    newObject = { types: 4 };
    activeData.push(newObject);
    //console.log(activeData);
    constructChart(activeData[activeData.length - 1]);
    updateChart();
    addPresent = false;
    buttonDiv.remove();
    if (true) {
      createButton();
      updateChart();
    }
  });
}

// This section is to remove all open tooltips when the mouse leaves the chart area
// Honestly, I would have implemented it on when the mouse leaves a tooltip that tooltip closes, but I couldn't get that to work
const chartBorder = d3.selectAll(".chart_border");
chartBorder.on("mouseover", function () {
  // Hide the tooltip
  const tooltips = chartContainer.selectAll(".tooltip");
  tooltips
    .style("visibility", "hidden")
    .style("opacity", 0)
    .style("width", ".5rem");

  // Hide the tooltip buttons
  const tooltipButtons = chartContainer.selectAll(".button.typeTool");
  tooltipButtons
    .style("visibility", "hidden")
    .style("opacity", 0)
    .style("width", ".9rem")
    .style("left", "0rem");
});

// call the updateChart function initially to create the initial charts
initiateCharts();

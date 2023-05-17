// chartContainer is just a variable to hold the div chart container, which should be used to place and show the 5 horizontal bar charts
let chartContainer = d3.select("#chart_container"); //.append("svg").append("g");

// Create an activeData variable, so store data for our 5 variables of interest.  Each starts as count 0 to wait for statsMap to be created and store the actual information.
activeData = [
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
  {
    types: 14,
  },
  {
    types: 24,
  },
  {
    types: 34,
  },
  {
    types: 124,
  },
  {
    types: 134,
  },
  {
    types: 234,
  },
];

// This function creates a chart, given an object with 'types'
function constructChart(dataObj) {
  // Make the tab label symbol which represents which types are importnatn
  let svgsymbol = createIcon(
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

  // create the initial bar with zero width
  chart
    .append("rect")
    .attr("class", "bar")
    .attr("x", 40)
    .attr("y", (height - barHeight) / 2)
    .attr("width", 0)
    .attr("height", barHeight)
    .attr("fill", "white");

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
     <!--Type 1-->
      <button class="button typeTool serotypeSwitch_1 ${dataObj.types.toString().includes("1") ? "active-button" : "inactive-button"}">1</button>
     <!--Type 2-->
      <button class="button typeTool serotypeSwitch_2 ${dataObj.types.toString().includes("2") ? "active-button" : "inactive-button"}">2</button>
     <!--Type 3-->
      <button class="button typeTool serotypeSwitch_3 ${dataObj.types.toString().includes("3") ? "active-button" : "inactive-button"}">3</button>
     <!--Type 4-->
      <button class="button typeTool serotypeSwitch_4 ${dataObj.types.toString().includes("4") ? "active-button" : "inactive-button"}">4</button>
    </span>
  </button>`
    );

  // Tab Interaction Events!
  typeButton
    .select("button")
    .on("click", function () {
      //console.log("tab clicked");
    })
    .on("mousedown", function () {
      //console.log("mouse down on tab");
    })
    .on("mouseover", function () {
      // Show the tooltip
      const tooltip = chart.select(".tooltip");
      tooltip.style("visibility", "visible").style("opacity", 1).style("width", "6.5rem");

      // Show the tooltip buttons
      const tooltipButtons = chart.selectAll(".button.typeTool");
      tooltipButtons.style("visibility", "visible").style("opacity", 1).style("left", ".5rem");
      tooltipButtons.on("mouseover",function () {
        // on hover the buttons,  keep the whole tooltip visible
        tooltip.style("visibility", "visible").style("opacity", 1).style("width", "6.5rem");
        tooltipButtons.style("visibility", "visible").style("opacity", 1).style("left", ".5rem");
      })
    })
    .on("mouseout", function () {
      // Hide the tooltip
      const tooltip = chart.select(".tooltip");
      tooltip.style("visibility", "hidden").style("opacity", 0).style("width", ".5rem");

      // Hide the tooltip buttons
      const tooltipButtons = chart.selectAll(".button.typeTool");
      tooltipButtons.style("visibility", "hidden").style("opacity", 0).style("left", "0rem");
    })
    .on("dblclick", function () {
      // Transition to remove the chart
      chart
        .transition()
        .duration(200)
        .attr("transform", "translate(" + -40 + ", 0)")
        .style("opacity", 0)
        .remove();
      // get index of dataObj
      const index = activeData.indexOf(dataObj);
      // remove that item from activeData array
      activeData.splice(index, 1);
    });

  dataObj.chart = chart;
}

// updateChart updates the whole chart panel every time there is new data
function updateChart() {
  // upon updateChart being called, the activeData variable is updated
  activeData.forEach((dataObj) => {
    activeVars = dataObj.types;
    dataObj.count = statsMap["c" + activeVars];
  });

  // use something like this to remove specific charts
  // chartContainer.selectAll("*").remove();

  // create a new chart for each object in activeData
  activeData.forEach((dataObj) => {
    // set the width and height of each chart
    const width = chartContainer.node().getBoundingClientRect().width;
    const barWidth = width * 0.8;

    // get chart from data object
    let chart = dataObj.chart;

    // update the bar width and count label to match the dataObj count value
    chart
      .selectAll(".bar")
      .transition()
      .duration(200)
      .attr("width", (barWidth * dataObj.count) / (statsMap.events + 1));
    chart
      .selectAll(".count-label")
      .transition()
      .duration(200)
      // this .att sets the position of the label, as defined by the number of digits in the label
      .attr(
        "x",
        (barWidth * dataObj.count) / (statsMap.events + 1) +
          (chart.select(".count-label")._groups[0][0].innerHTML.length + 5) * 10
      )
      .text(dataObj.count);
  });
}

// This function adds the starting charts and is where any other chart code should go that should just be ran on start
function initiateCharts() {
  // construct chart for each row of data
  activeData.forEach((dataObj) => {
    constructChart(dataObj);
  });

  createButton();
  /*
  // Create a button below the last chart
  const buttonDiv = chartContainer.append("div").attr("class", "button-div");

  // Append a button element to the button container
  buttonDiv.append("button").attr("class", "button addChart").text("+");

  // Add an event listener to the button
  buttonDiv.select("button").on("click", function () {
    newObject = { types: 1234 };
    activeData.push(newObject);
    //console.log(activeData);
    constructChart(activeData[activeData.length - 1]);
    updateChart();

    buttonDiv.remove();
    //buttonDiv.append("button").attr("class", "button addChart").text("+");

    /*
    // Get the reference to the div element with class "button-div"
    const buttonDiv = chartContainer.querySelector(".button-div");

    buttonDiv.remove();

    console.log(buttonDiv)

    chartContainer._groups[0][0].remove(buttonDiv)

    //var chartContainer = document.querySelector("#chart_Container");

    // Get the reference to the last SVG element within the chart container
    //const lastSVG = chartContainer.querySelector("svg:last-of-type");

    // Move the button div after the last SVG element
    //chartContainer.insertBefore(buttonDiv, lastSVG.nextSibling);

    console.log(chartContainer._groups[0][0]);
    
  });*/
}

function createButton() {
  // Create a button below the last chart
  const buttonDiv = chartContainer.append("div").attr("class", "button-div");

  // Append a button element to the button container
  buttonDiv.append("button").attr("class", "button addChart").text("+");

  // Add an event listener to the button
  buttonDiv.select("button").on("click", function () {
    newObject = { types: 1 };
    activeData.push(newObject);
    //console.log(activeData);
    constructChart(activeData[activeData.length - 1]);
    updateChart();

    buttonDiv.remove();
    createButton();
  });
}

// call the updateChart function initially to create the initial charts
initiateCharts();

window.onresize = updateChart;

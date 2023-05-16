// chartContainer is just a variable to hold the div chart container, which should be used to place and show the 5 horizontal bar charts
let chartContainer = d3.select("#chart_container"); //.append("svg").append("g");

let tabLabel = document.createElement("button");
tabLabel.className = "tab";
tabLabel.addEventListener("click", function () {
  alert("tab clicked");
});

let chartsActive = [];

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

  console.log(svgsymbol.options.html);

  // set the width and height of each chart
  const width = chartContainer.node().getBoundingClientRect().width;
  const barWidth = width ;
  const height = 30;
  const barHeight = 10;

  // create a new svg element for each chart
  const chart = chartContainer
    .append("svg")
    .attr("width", width)
    .attr("height", height);

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
    .html(`<button class="tab_label">${svgsymbol.options.html}</button>`);

  typeButton.select("button").on("click", function () {
    alert("tab clicked");
  });

  // add the count label to the right of the bar
  chart
    .append("text")
    .attr("class", "count-label")
    .attr("x", barWidth)
    .attr("y", height / 2 + 5)
    .attr("text-anchor", "end")
    .style("fill", "rgb(159, 159, 159)") // Set the text color to red
    .style("font-size", ".8rem") // Set the font size to 12 pixels
    //.style("font-family", "Arial") // Set the font family to Arial
    .text(dataObj.count);

  dataObj.chart = chart;
}

// This function adds the starting charts and is where any other chart code should go that should just be ran on start
function initiateCharts() {
  activeData.forEach((dataObj) => {
    constructChart(dataObj);
  });
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
    const width = chartContainer.node().getBoundingClientRect().width
    const barWidth = width*.8;

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

// call the updateChart function initially to create the initial charts
initiateCharts();

window.onresize = updateChart;
let statsMap;

// This is a function to be called when the year changes so that stats can be calculated for that year
function calculateStats() {
  // Calculate Min and Max years
  let timeRange = calculateTimeRange();
  // Get active countries
  let activeCountries = getActiveCountries(visibleCategoryGroups);
  // Get Data for time-frame
  let timeRangeData = getDataForTimeRange(timeRange, activeCountries);
  // Find Stats
  statsMap = calculateTimeRangeStats(timeRangeData);

  // Display General Stats
  updateStatsTitle(timeRange);
  updateChart();
  // Display Co-Occurance
  //console.log(statsMap)
}

// Calculate the actual min and max years
function calculateTimeRange() {
  // identify the min year
  function calculateYearMin() {
    let yearHolder = activeYear - yearDelay;
    if (yearHolder < minYear) {
      yearHolder = minYear;
    }
    return yearHolder;
  }
  let yearMin = calculateYearMin();
  let yearMax = activeYear;

  return [yearMin, yearMax];
}

// Get a list of all active countries
function getActiveCountries(visibleCategories) {
  let activeCountries = [];
  for (let i = 0; i < visibleCategories.length; i += 1) {
    activeCountries = activeCountries.concat(visibleCategories[i].countryList);
  }
  return activeCountries;
}

// Get a list of all events from min to max year
function getDataForTimeRange(timeRange, activeCountries) {
  let pointEvents = [];
  for (let i = timeRange[0]; i <= timeRange[1]; i += 1) {
    for (row in dataset[i]) {
      if (activeCountries.includes(dataset[i][row]["COUNTR"])) {
        pointEvents.push(dataset[i][row]);
      }
    }
  }
  return pointEvents;
}

// Return an object of stats from local data
function calculateTimeRangeStats(data) {
  let stats = {};
  // Get count of total events
  stats.events = data.length;

  // Get count of each serotype
  stats.c1 = 0;
  stats.c2 = 0;
  stats.c3 = 0;
  stats.c4 = 0;
  stats.c12 = 0; // 12/21
  stats.c13 = 0; // 13/31
  stats.c14 = 0; // 14/41
  stats.c23 = 0; // 23/32
  stats.c24 = 0; // 24/42
  stats.c34 = 0; // 34/43
  stats.c123 = 0;
  stats.c124 = 0;
  stats.c134 = 0;
  stats.c234 = 0;
  stats.c1234 = 0;
  for (row in data) {
    // Count all single occuracences
    stats.c1 += data[row].DEN1;
    stats.c2 += data[row].DEN2;
    stats.c3 += data[row].DEN3;
    stats.c4 += data[row].DEN4;
    // Count all double cooccuracences
    if (data[row].DEN1 + data[row].DEN2 == 2) {
      stats.c12 += 1;
    }
    if (data[row].DEN1 + data[row].DEN3 == 2) {
      stats.c13 += 1;
    }
    if (data[row].DEN1 + data[row].DEN4 == 2) {
      stats.c14 += 1;
    }
    if (data[row].DEN2 + data[row].DEN3 == 2) {
      stats.c23 += 1;
    }
    if (data[row].DEN2 + data[row].DEN4 == 2) {
      stats.c24 += 1;
    }
    if (data[row].DEN3 + data[row].DEN4 == 2) {
      stats.c34 += 1;
    }
    // Count all triple cooccuracences
    if (data[row].DEN1 + data[row].DEN2 + data[row].DEN3 == 3) {
      stats.c123 += 1;
    }
    if (data[row].DEN1 + data[row].DEN2 + data[row].DEN4 == 3) {
      stats.c124 += 1;
    }
    if (data[row].DEN1 + data[row].DEN3 + data[row].DEN4 == 3) {
      stats.c134 += 1;
    }
    if (data[row].DEN4 + data[row].DEN2 + data[row].DEN3 == 3) {
      stats.c234 += 1;
    }
    // Count all total cooccuracences
    if (
      data[row].DEN1 + data[row].DEN2 + data[row].DEN3 + data[row].DEN4 ==
      4
    ) {
      stats.c1234 += 1;
    }
  }

  stats.percent1 = (stats.c1 / stats.events) * 100;
  stats.percent2 = (stats.c2 / stats.events) * 100;
  stats.percent3 = (stats.c3 / stats.events) * 100;
  stats.percent4 = (stats.c4 / stats.events) * 100;

  return stats;
}

const barTitle = document.getElementById("barTitle");

// create a rounding function
function roundTo(n, place) {
  return +(Math.round(n + "e+" + place) + "e-" + place);
}

function updateStatsTitle(timeRange) {
  //console.log(statsMap.count1)
  let string = "";

  if (timeRange[0] == timeRange[1]) {
    string +=
      "<div class='headerText' id='barchartTitle'><b class='big'>" +
      timeRange[0] +
      "</b></div>";
  } else {
    string +=
      "<div class='headerText' id='barchartTitle'><b class='big'>" +
      timeRange[0] +
      "</b> to <b class='big'>" +
      timeRange[1] +
      "</b></div>";
  }

  string +=
    "<div class='headerText' id='barchartSubtitle'><b class='big'>" +
    statsMap.events +
    "</b> Reported Cases</div><br>";
  //string += "<div class='typeStats t1 active'><b class='big'>1</b> - <em>n:</em> " + statsMap.count1 + ", \t <em>p:</em> " + roundTo(statsMap.percent1, 2) + "%</div>"
  //string += "<div class='typeStats t2 active'><b class='big'>2</b> - <em>n:</em> " + statsMap.count2 + ", \t <em>p:</em> " + roundTo(statsMap.percent2, 2) + "%</div>"
  //string += "<div class='typeStats t3 active'><b class='big'>3</b> - <em>n:</em> " + statsMap.count3 + ", \t <em>p:</em> " + roundTo(statsMap.percent3, 2) + "%</div>"
  //string += "<div class='typeStats t4 active'><b class='big'>4</b> - <em>n:</em> " + statsMap.count4 + ", \t <em>p:</em> " + roundTo(statsMap.percent4, 2) + "%</div>"
  barTitle.innerHTML = string;
}

let statsMap;

// This is a function to be called when the year changes so that stats can be calculated for that year
function calculateStats() {
  // Calculate Min and Max years
  let timeRange = calculateTimeRange();
  // Get Data for time-frame
  let timeRangeData = getDataForTimeRange(timeRange);
  // Find Stats
  statsMap = calculateTimeRangeStats(timeRangeData)

  // Display General Stats
  updateStatsPanel(timeRange)
  // Display Co-Occurance
  console.log(statsMap)
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

// Get a list of all events from min to max year
function getDataForTimeRange(timeRange) {
  let pointEvents = [];
  for (let i = timeRange[0]; i <= timeRange[1]; i += 1) {
    for (row in dataset[i]) {
      pointEvents.push(dataset[i][row]);
    }
  }
  return pointEvents;
}

// Return an object of stats from local data
function calculateTimeRangeStats(data) {
    let stats = {};
    // Get count of total events
    stats.events = data.length

    // Get count of each serotype
    stats.count1 = 0
    stats.count2 = 0
    stats.count3 = 0
    stats.count4 = 0
    stats.cooccur_12 = 0 // 12/21
    stats.cooccur_13 = 0 // 13/31
    stats.cooccur_14 = 0 // 14/41
    stats.cooccur_23 = 0 // 23/32
    stats.cooccur_24 = 0 // 24/42
    stats.cooccur_34 = 0 // 34/43
    stats.cooccur_123 = 0
    stats.cooccur_124 = 0
    stats.cooccur_423 = 0
    stats.cooccur_1234 = 0
    for (row in data) {
        // Count all single occuracences
        stats.count1 += data[row].DEN1
        stats.count2 += data[row].DEN2
        stats.count3 += data[row].DEN3
        stats.count4 += data[row].DEN4
        // Count all double cooccuracences
        if ((data[row].DEN1 + data[row].DEN2) == 2){
            stats.cooccur_12 += 1;
        }
        if ((data[row].DEN1 + data[row].DEN3) == 2){
            stats.cooccur_13 += 1;
        }
        if ((data[row].DEN1 + data[row].DEN4) == 2){
            stats.cooccur_14 += 1;
        }
        if ((data[row].DEN2 + data[row].DEN3) == 2){
            stats.cooccur_23 += 1;
        }
        if ((data[row].DEN2 + data[row].DEN4) == 2){
            stats.cooccur_24 += 1;
        }
        if ((data[row].DEN3 + data[row].DEN4) == 2){
            stats.cooccur_34 += 1;
        }
        // Count all triple cooccuracences
        if ((data[row].DEN1 + data[row].DEN2 + data[row].DEN3) == 3){
            stats.cooccur_123 += 1;
        }
        if ((data[row].DEN1 + data[row].DEN2 + data[row].DEN4) == 3){
            stats.cooccur_124 += 1;
        }
        if ((data[row].DEN4 + data[row].DEN2 + data[row].DEN3) == 3){
            stats.cooccur_423 += 1;
        }
        // Count all total cooccuracences
        if ((data[row].DEN1 + data[row].DEN2 + data[row].DEN3 + data[row].DEN4) == 4){
            stats.cooccur_1234 += 1;
        }
    }


    stats.percent1 = (stats.count1 / stats.events)*100
    stats.percent2 = (stats.count2 / stats.events)*100
    stats.percent3 = (stats.count3 / stats.events)*100
    stats.percent4 = (stats.count4 / stats.events)*100

    return stats;
  }

const statSheet = document.getElementById("statSheet");

// create a rounding function
function roundTo(n, place) {    
    return +(Math.round(n + "e+" + place) + "e-" + place);
}

function updateStatsPanel(timeRange) {    
    let string = ""

    if (timeRange[0] == timeRange [1]) {
        string += "<div class='headerText'><b class='big'>" + timeRange[0] + "</b></div>"
    } else {
        string += "<div class='headerText'><b class='big'>" + timeRange[0] + "</b> to <b class='big'>" + timeRange[1] + "</b></div>"
    }

    string += "<div class='headerText'>Total Events: <b class='big'>" + statsMap.events + "</b></div><br>"
    string += "<div class='typeStats t1 active'><b class='big'>1</b> - <em>n:</em> " + statsMap.count1 + ", \t <em>p:</em> " + roundTo(statsMap.percent1, 2) + "%</div>"
    string += "<div class='typeStats t2 active'><b class='big'>2</b> - <em>n:</em> " + statsMap.count2 + ", \t <em>p:</em> " + roundTo(statsMap.percent2, 2) + "%</div>"
    string += "<div class='typeStats t3 active'><b class='big'>3</b> - <em>n:</em> " + statsMap.count3 + ", \t <em>p:</em> " + roundTo(statsMap.percent3, 2) + "%</div>"
    string += "<div class='typeStats t4 active'><b class='big'>4</b> - <em>n:</em> " + statsMap.count4 + ", \t <em>p:</em> " + roundTo(statsMap.percent4, 2) + "%</div>"
    statSheet.innerHTML = string
}
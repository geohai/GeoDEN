//--VARIABLES--//

//-Button Holders-//
// - serotype toggles
const button1 = document.getElementById("serotypeCheck_1");
const button2 = document.getElementById("serotypeCheck_2");
const button3 = document.getElementById("serotypeCheck_3");
const button4 = document.getElementById("serotypeCheck_4");
// - midpoint toggles
const focusMidpointButton = document.getElementById("focusMidpointButton");
const typeMidpointButton = document.getElementById("typeMidpointButton");
const traceMidpointButton = document.getElementById("traceMidpointButton");
const soloMidpointButton = document.getElementById("soloMidpointButton");
// - animation buttons
const animButton = document.getElementById("playButton");

const yearInput = document.getElementById("year");
const delayInput = document.getElementById("current_yearDelay");

// Input Variables
let type1_active = 1;
let type2_active = 1;
let type3_active = 1;
let type4_active = 1;
let midpointMode = false;
let animation_active = false;
let animSpeed = 300;
let midpointTrace = false;
let showEventPoints = true;

//--EVENT LISTENERS--//

// Serotype Toggles
button1.addEventListener("click", () => {
  type1_active = !type1_active;
  button1.classList.toggle("active-button", type1_active);
  button1.classList.toggle("inactive-button", !type1_active);
  updateSymbols(activeYear, (reset = true));
});
button2.addEventListener("click", () => {
  type2_active = !type2_active;
  button2.classList.toggle("active-button", type2_active);
  button2.classList.toggle("inactive-button", !type2_active);
  updateSymbols(activeYear, (reset = true));
});
button3.addEventListener("click", () => {
  type3_active = !type3_active;
  button3.classList.toggle("active-button", type3_active);
  button3.classList.toggle("inactive-button", !type3_active);
  updateSymbols(activeYear, (reset = true));
});
button4.addEventListener("click", () => {
  type4_active = !type4_active;
  button4.classList.toggle("active-button", type4_active);
  button4.classList.toggle("inactive-button", !type4_active);
  updateSymbols(activeYear, (reset = true));
});

// Midpoint Toggle
focusMidpointButton.addEventListener("click", () => {
  midpointMode = !midpointMode;
  focusMidpointButton.classList.toggle("active-mid", midpointMode);
  focusMidpointButton.classList.toggle("inactive-mid", !midpointMode);
  if (midpointMode) {
    focusMidpointButton.innerHTML =
      '<img class="midpointControl-icon" src="img/enlarge.svg" /><span class="tooltip midpointControl"><b>Smaller</b></br>Centroids</span>';
  } else {
    focusMidpointButton.innerHTML =
      '<img class="midpointControl-icon" src="img/shrink.svg" /><span class="tooltip midpointControl"><b>Larger</b></br>Centroids</span>';
  }
  updateSymbols(activeYear, (reset = true));
});

// Type Based Midpoint Toggle
typeMidpointButton.addEventListener("click", () => {
  serotypeMidpoints = !serotypeMidpoints;
  typeMidpointButton.classList.toggle("active-mid", serotypeMidpoints);
  typeMidpointButton.classList.toggle("inactive-mid", !serotypeMidpoints);
  if (serotypeMidpoints) {
    typeMidpointButton.innerHTML =
      '<img class="midpointControl-icon" src="img/multipleType.svg" /><span class="tooltip midpointControl"><b>Regional</b></br>Centroids</span>';
  } else {
    typeMidpointButton.innerHTML =
      '<img class="midpointControl-icon" src="img/singleType.svg" /><span class="tooltip midpointControl"><b>Serotype</b></br>Centroids</span>';
  }
  updateSymbols(activeYear, (reset = true));
});

// Trace Midpoints Toggle
traceMidpointButton.addEventListener("click", () => {
  midpointTrace = !midpointTrace;
  traceMidpointButton.classList.toggle("active-mid", midpointTrace);
  traceMidpointButton.classList.toggle("inactive-mid", !midpointTrace);
  if (midpointTrace) {
    traceMidpointButton.innerHTML =
      '<img class="midpointControl-icon" src="img/trace.svg" /><span class="tooltip midpointControl"><b>Average Centroid</b></span>';
  } else {
    traceMidpointButton.innerHTML =
      '<img class="midpointControl-icon" src="img/point.svg" /><span class="tooltip midpointControl"><b>Trace Centroids</b></br><em>Requires a Delay</em></span>';
  }
  updateSymbols(activeYear, (reset = true));
});

// Show Only Midpoints Toggle
soloMidpointButton.addEventListener("click", () => {
  showEventPoints = !showEventPoints;
  soloMidpointButton.classList.toggle("active-mid", showEventPoints);
  soloMidpointButton.classList.toggle("inactive-mid", !showEventPoints);
  if (showEventPoints) {
    soloMidpointButton.innerHTML =
      '<img class="midpointControl-icon" src="img/show.svg" /><span class="tooltip midpointControl"><b>Hide</b></br>Reports</span>';
  } else {
    soloMidpointButton.innerHTML =
      '<img class="midpointControl-icon" src="img/hide.svg" /><span class="tooltip midpointControl"><b>Show</b></br>Reports</span>';
  }

  updateSymbols(activeYear, (reset = true));
});

// Animation Toggle
animButton.addEventListener("click", () => {
  animation_active = !animation_active;
  animButton.classList.toggle("active-animButton", animation_active);
  animButton.classList.toggle("inactive-animButton", !animation_active);
  start_mapAnimation();
});

// Keyboard Inputs
document.addEventListener("keydown", function (event) {
  const activeElement = document.activeElement;
  if (activeElement.tagName.toLowerCase() === "input") {
    // An input element has focus
    return;
  }

  if (event.key == " ") {
    event.preventDefault();
    animation_active = !animation_active;
    start_mapAnimation();
  } else if (event.keyCode == "39") {
    event.preventDefault();
    if (activeYear < maxYear) {
      // update variables and visuals to show new year
      activeYear = parseInt(activeYear) + 1;
    } else {
      activeYear = minYear;
    }
    $(".range-slider").val(parseInt(activeYear));
    updateSymbols(activeYear);
  } else if (event.keyCode == "37") {
    event.preventDefault();
    if (activeYear > minYear) {
      // update variables and visuals to show new year
      activeYear = parseInt(activeYear) - 1;
    } else {
      activeYear = maxYear;
    }
    $(".range-slider").val(parseInt(activeYear));
    updateSymbols(activeYear);
  } else if (event.keyCode == "38") {
    event.preventDefault();
    if (yearDelayVisual < maxYear - minYear + 1) {
      submit_YearDelay(yearDelayVisual + 1);
    }
  }
  if (event.keyCode == "40") {
    event.preventDefault();
    if (yearDelayVisual > 1) {
      submit_YearDelay(yearDelayVisual - 1); // Wait for 500ms (0.5 seconds) before calling updateSymbols
    }
  }
});

//--FUNCTIONS--//
function updateAnimSpeed() {
  const sliderValue = parseInt(document.getElementById("animationSpeed").value);
  animSpeed = sliderValue ** -1 * 1000;
}

function serotypeCheck(type) {
  if (type == 1) {
    type1_active = !type1_active;
    button1.classList.toggle("active-button", bool4);
    button4.classList.toggle("inactive-button", !bool4);
  }
  if (type == 2) {
    type2_active = !type2_active;
  }
  if (type == 3) {
    type3_active = !type3_active;
  }
  if (type == 4) {
    type4_active = !type4_active;
  }

  updateSymbols(activeYear, (reset = true));
  //setTimeout(() => {}, 500); // Wait for 500ms (0.5 seconds) before calling updateSymbols
}

function midpointModeCheck() {
  midpointMode = document.querySelector("#midpointModeCheck").checked;
  updateSymbols(activeYear, (reset = true));
}

function start_mapAnimation() {
  if (animation_active) {
    animButton.innerHTML =
      '<img src="img/pause-solid.svg" id="playButtonIMG"><span class="tooltip playTooltip"><b>Stop Animation</b></span>';
  } else {
    animButton.innerHTML =
      '<img src="img/play-solid.svg" id="playButtonIMG"><span class="tooltip playTooltip"><b>Start Animation</b></span>';
  }

  // set speed
  let delayInMilliseconds = animSpeed;

  let animateSingleYear = () =>
    setTimeout(function () {
      if (animation_active && parseInt(activeYear) < maxYear) {
        delayInMilliseconds = animSpeed;
        updateSymbols(parseInt(activeYear) + 1);
        animateSingleYear();
        //Step 8: update slider
        $(".range-slider").val(parseInt(activeYear));
      } else {
        animation_active = false;
        start_mapAnimation();
        if (activeYear == maxYear) {
          activeYear = minYear;
        }
      }
    }, delayInMilliseconds);

  if (animation_active) {
    animateSingleYear(); //start loop
  }
}

// On submit, check the value then change the activeYear to the input value
yearInput.addEventListener("keyup", (event) => {
  if (event.key == "Enter") {
    // get input vaue
    let value = yearInput.value;
    // if value == nthing, do nothing
    // if value < 1943 or > 2020, deny input
    // if value in range,
    if (parseInt(value) >= minYear && parseInt(value) <= maxYear) {
      // update slider and symbols
      $(".range-slider").val(parseInt(value));
      updateSymbols(parseInt(value));
      yearInput.blur();
      return;
    }
    if (value == "") {
      yearInput.blur();
      return;
    }
    alert("Value must be any year from 1943 to " + maxYear);
  }
  event.preventDefault(); // prevent form from submitting
  // do something here
});

// On stop focus on the yearInput box, just show the default value
yearInput.addEventListener("blur", (event) => {
  yearInput.value = "";
});

/*-- Year Delay --*/

// Set initial value to 0
delayInput.value = yearDelayVisual;

// On enter, submit the value
delayInput.addEventListener("keyup", (event) => {
  if (event.key === "Enter") {
    delayInput.blur();
  }
  event.preventDefault();
});

// On stop focus on the yearInput box, just show the default value
delayInput.addEventListener("blur", (event) => {
  submit_YearDelay(parseInt(delayInput.value.trim()));
});

// On input event (including arrow button clicks), update the year delay
delayInput.addEventListener("input", () => {
  let value = parseInt(delayInput.value.trim());
  if (!isNaN(value) && value >= 1 && value <= 78) {
    submit_YearDelay(value);
  }
});

// Show alert for value range
function showRangeAlert() {
  alert("Value must be between 1 and " + (maxYear - minYear + 1));
}

// function to set a new year based on typing and submitting a new year
function submit_YearDelay(inputInt, submitErrors = true) {
  if (inputInt <= maxYear - minYear + 1 && inputInt >= 1) {
    yearDelayVisual = inputInt;
    delayInput.value = yearDelayVisual.toString();
    yearDelay = yearDelayVisual - 1;
    updateSymbols(activeYear);
  } else {
    if (submitErrors) {
      showRangeAlert();
    }
  }
}

//wait .5 disableing space bar for all input elements
function disableSpaceForInputs() {
  setTimeout(() => {
    const inputElements = document.querySelectorAll("input");
    inputElements.forEach(function (inputElement) {
      inputElement.addEventListener("keydown", function (event) {
        if (event.keyCode == 32) {
          event.preventDefault(); // Prevent space key default action
        }
      });
    });
  }, 200);
}

disableSpaceForInputs();

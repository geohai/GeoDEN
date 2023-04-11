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
const input_yearDelay = document.getElementById("input_yearDelay");
const submit_YearDelayButton = document.getElementById("submit_YearDelay");

const yearInput = document.getElementById("year");

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

// General Variable
let minYear = 1943;
let maxYear = 2020;

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
  focusMidpointButton.classList.toggle("active-button", midpointMode);
  focusMidpointButton.classList.toggle("inactive-button", !midpointMode);
  updateSymbols(activeYear, (reset = true));
});

// Type Based Midpoint Toggle
typeMidpointButton.addEventListener("click", () => {
  serotypeMidpoints = !serotypeMidpoints;
  typeMidpointButton.classList.toggle("active-button", serotypeMidpoints);
  typeMidpointButton.classList.toggle("inactive-button", !serotypeMidpoints);
  updateSymbols(activeYear, (reset = true));
});

// Trace Midpoints Toggle
traceMidpointButton.addEventListener("click", () => {
  midpointTrace = !midpointTrace;
  traceMidpointButton.classList.toggle("active-button", midpointTrace);
  traceMidpointButton.classList.toggle("inactive-button", !midpointTrace);
  updateSymbols(activeYear, (reset = true));
});

// Show Only Midpoints Toggle
soloMidpointButton.addEventListener("click", () => {
  showEventPoints = !showEventPoints;
  soloMidpointButton.classList.toggle("active-button", !showEventPoints);
  soloMidpointButton.classList.toggle("inactive-button", showEventPoints);
  updateSymbols(activeYear, (reset = true));
});

// Animation Toggle
animButton.addEventListener("click", () => {
  animation_active = !animation_active;
  animButton.classList.toggle("active-button", animation_active);
  animButton.classList.toggle("inactive-button", !animation_active);
  start_mapAnimation();
});

// Keyboard Inputs
document.addEventListener("keydown", function (event) {
  if (event.key == " ") {
    event.preventDefault();
    animation_active = !animation_active;
    start_mapAnimation();
  } else if (event.keyCode == "39") {
    event.preventDefault();
    if (activeYear < 2020) {
      // update variables and visuals to show new year
      activeYear = parseInt(activeYear) + 1;
    } else {
      activeYear = 1943;
    }
    $(".range-slider").val(parseInt(activeYear));
    updateSymbols(activeYear);
  } else if (event.keyCode == "37") {
    event.preventDefault();
    if (activeYear > 1943) {
      // update variables and visuals to show new year
      activeYear = parseInt(activeYear) - 1;
    } else {
      activeYear = 2020;
    }
    $(".range-slider").val(parseInt(activeYear));
    updateSymbols(activeYear);
  } else if (event.keyCode == "38") {
    if (animSpeed > 110) {
      animSpeed -= 100;
    }
  } else if (event.keyCode == "40") {
    if (animSpeed < 1600) {
      animSpeed += 100;
    }
  }
});

//--FUNCTIONS--//

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
    animButton.innerHTML = '<img src="img/pause-solid.svg"><span class="tooltip top">Speed Up: <b>↑</b><br>Slow Down: <b>↓</b><br><br>Stop <b>animation</b></span>';
  } else {
    animButton.innerHTML = '<img src="img/play-solid.svg"><span class="tooltip top">Speed Up: <b>↑</b><br>Slow Down: <b>↓</b><br><br>Start <b>animation</b></span>';
  }

  // set speed
  let delayInMilliseconds = animSpeed;

  let animateSingleYear = () =>
    setTimeout(function () {
      if (animation_active && parseInt(activeYear) < 2020) {
        delayInMilliseconds = animSpeed;
        updateSymbols(parseInt(activeYear) + 1);
        animateSingleYear();
        //Step 8: update slider
        $(".range-slider").val(parseInt(activeYear));
      } else {
        animation_active = false;
        start_mapAnimation();
        if (activeYear == 2020) {
          activeYear = 1943;
        }
      }
    }, delayInMilliseconds);

  if (animation_active) {
    animateSingleYear(); //start loop
  }
}

input_yearDelay.addEventListener("input", () => {
  if (input_yearDelay.value) {
    activate_yearDelay();
  } else {
    deactivate_yearDelay();
  }
});

function activate_yearDelay() {
  input_yearDelay.classList.toggle("active-button", true);
  input_yearDelay.classList.toggle("inactive-button", false);
  submit_YearDelayButton.classList.toggle("active-button", true);
  submit_YearDelayButton.classList.toggle("inactive-button", false);
}

function deactivate_yearDelay() {
  input_yearDelay.classList.toggle("active-button", false);
  input_yearDelay.classList.toggle("inactive-button", true);
  submit_YearDelayButton.classList.toggle("active-button", false);
  submit_YearDelayButton.classList.toggle("inactive-button", true);
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
    alert("Value must be any year from 1943 to 2020");
  }
  event.preventDefault(); // prevent form from submitting
  // do something here
});

// On stop focus on the yearInput box, just show the default value
yearInput.addEventListener("blur", (event) => {
  yearInput.value = "";
});

//--VARIABLES--//

// Button Holders
const button1 = document.getElementById("serotypeCheck_1");
const button2 = document.getElementById("serotypeCheck_2");
const button3 = document.getElementById("serotypeCheck_3");
const button4 = document.getElementById("serotypeCheck_4");
const midpointButton = document.getElementById("midpointButton");
const animButton = document.getElementById("playButton");

// Input Variables
let type1_active = 1;
let type2_active = 1;
let type3_active = 1;
let type4_active = 1;
let midpointMode = false;
let animation_active = false;
let animSpeed = 300;

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
midpointButton.addEventListener("click", () => {
  midpointMode = !midpointMode;
  midpointButton.classList.toggle("active-button", midpointMode);
  midpointButton.classList.toggle("inactive-button", !midpointMode);
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
    if (activeYear < 2013) {
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
      activeYear = 2013;
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
    animButton.innerHTML = '<img src="img/pause-solid.svg">';
  } else {
    animButton.innerHTML = '<img src="img/play-solid.svg">';
  }

  // set speed
  let delayInMilliseconds = animSpeed;

  let animateSingleYear = () =>
    setTimeout(function () {
      if (animation_active && parseInt(activeYear) < 2013) {
        delayInMilliseconds = animSpeed;
        updateSymbols(parseInt(activeYear) + 1);
        animateSingleYear();
        //Step 8: update slider
        $(".range-slider").val(parseInt(activeYear));
      } else {
        animation_active = false;
        start_mapAnimation();
        if (activeYear==2013){activeYear = 1943;}
      }
    }, delayInMilliseconds);

  if (animation_active) {
    animateSingleYear(); //start loop
  }
}

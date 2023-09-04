"use strict";

window.onresize = function () {
  updateChart();
  constructTimeView();
};

// This all is for the resize tool
// Variables that are important for the resize tool
$("#resizeTool").on("mousedown", resizeDrag);
let isResizingMap = false;
let mouseResizePos;
let resizeInterval;

// Mouse Down on resize tool
function resizeDrag() {
  isResizingMap = true;
  mouseResizePos = event.clientX;
}

//console.log(window.outerHeight);

// Drag resize tool
window.addEventListener("mousemove", function () {
  if (isResizingMap) {
    const resizePercent = (event.clientY / window.innerHeight) * 100;
    const resizeValue =
      resizePercent < 20 ? 20 : resizePercent > 95 ? 95 : resizePercent;
    document.documentElement.style.setProperty(
      "--mapTimeviewBorder",
      resizeValue + "%"
    );

    // Clear the previous interval if it exists
    clearInterval(resizeInterval);

    // Set up a new interval to trigger the resize event
    resizeInterval = setInterval(function () {
      window.dispatchEvent(new Event("resize"));
    }, 1 );
  }
});

// Let Go of tool
window.addEventListener("mouseup", function () {
  if (isResizingMap) {
    isResizingMap = false;
    clearInterval(resizeInterval);
  }
});

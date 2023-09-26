// Check if the opening dialog should be displayed
function shouldDisplayOpeningDialog() {
  const lastVisit = localStorage.getItem("lastVisit");
  if (!lastVisit) {
    // If there is no last visit, display the opening dialog
    return true;
  }

  const now = new Date().getTime();
  const oneDay = 1000 * 60 * 60 * 24; // One day in milliseconds
  const timeSinceLastVisit = now - lastVisit;

  return timeSinceLastVisit > oneDay;
}

// Show the opening dialog
function showOpeningDialog() {
  const openingDialog = document.getElementById("opening_dialog");
  openingDialog.style.display = "flex";
}

// Close the opening dialog
function closeOpeningDialog() {
  const openingDialog = document.getElementById("opening_dialog");
  openingDialog.style.display = "none";
}

// Set the last visit time in the local storage
function setLastVisit() {
  const now = new Date().getTime();

  // Create a cookie with SameSite set to 'Strict'
  document.cookie = `lastVisit=${now}; SameSite=Strict; max-age=${
    60 * 60 * 24
  }; path=/`;

  // Set the SameSite attribute for all cookies to 'Strict'
  document.cookie = "SameSite=Strict";

  localStorage.setItem("lastVisit", now);
}

// Event listener for the close button
document.getElementById("close_dialog").addEventListener("click", function () {
  closeOpeningDialog();
  setLastVisit();
});

// Event listener for the close button
document.getElementById("open_dialog").addEventListener("click", function () {
  showOpeningDialog();
});

// Check if the opening dialog should be displayed when the page loads
if (shouldDisplayOpeningDialog()) {
  showOpeningDialog();
}

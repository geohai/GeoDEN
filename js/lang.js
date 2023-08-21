// Load default language (e.g., English) when the page loads
window.addEventListener("DOMContentLoaded", function () {
  loadLanguage("en");
});

// Function to load language
function loadLanguage(lang) {
  // Fetch the JSON file for the selected language
  fetch(`/${lang}.json`)
    .then((response) => response.json())
    .then((data) => {
      // Replace content with translated strings
      document.getElementById("greeting").textContent = data.greeting;
      document.getElementById("actionButton").textContent = data.buttonLabel;
    })
    .catch((error) => {
      console.error("Error loading language file:", error);
    });
}

// Listen for language selection changes
document
  .getElementById("languageSelector")
  .addEventListener("change", function (event) {
    loadLanguage(event.target.value);
  });

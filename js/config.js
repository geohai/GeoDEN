// For each category in categoryGroups, make a div with the category name, visibility toggle, and edit button

// This function adds the starting categories
function initiateCategoryDivs() {
  // construct chart for each row of data
  allCategoryGroups.forEach((category) => {
    constructCategoryDiv(category);
  });

  //createButton();
}

// This function creates a the Category Div
function constructCategoryDiv(category) {
  //console.log(category);

  const container = d3.select("#categoryConfig");
  const countryConfig = d3.select("#countryConfig");
  const treeContainer = d3.select("#treeContainer");
  const categoryTitle = d3.select("#categoryTitle");

  // create a new svg element for each chart
  const categoryDiv = container.append("div").attr("class", "categoryDiv");

  categoryDiv
    .append("input")
    .attr("class", "categoryTitle")
    .attr("value", category.name);

  let eyeImg = "img/show.svg";
  if (category.hidden == true) {
    eyeImg = "img/hide.svg";
  }

  // Append a button for editing the category
  categoryDiv
    .append("button")
    .attr("class", "icon-button category-edit category-icon-button")
    .append("img")
    .attr("src", "img/edit.svg")
    .each(function () {
      d3.select(this).on("click", function () {
        editCategory(category);
      });
    });

  // Append a button for toggling the visibility
  categoryDiv
    .append("button")
    .attr("class", "icon-button visibility-toggle category-icon-button")
    .append("img")
    .attr("src", eyeImg)
    .each(function () {
      d3.select(this).on("click", function () {
        toggleVisibility(category);
      });
    });

  // Function to handle toggle visibility button click
  function toggleVisibility(category) {
    // Your logic for toggling visibility goes here
    //console.log("Visibility toggled for category:", category);
    //allCategoryGroups.category.hidden = !category.hidden;
    category.hidden = !category.hidden;
    // Update the source based on the 'hidden' state
    if (category.hidden == false) {
      d3.select(categoryDiv._groups[0][0].childNodes[2].childNodes[0]).attr(
        "src",
        "img/show.svg"
      );
    } else {
      d3.select(categoryDiv._groups[0][0].childNodes[2].childNodes[0]).attr(
        "src",
        "img/hide.svg"
      );
    }
    updateSymbols(activeYear, (reset = true));
  }

  // Function to handle edit category button click
  function editCategory(category) {
    // Remove the 'closed' class
    countryConfig.classed("closed", false);
    // Add the 'open' class
    countryConfig.classed("open", true);

    categoryTitle.attr("value", category.name);
  }

  /*Title Input*/

  categoryTitle.on("input", function () {})

  /*Exit Buttons*/

  // Get the buttons by their class name
  const submitButton = document.querySelector(".countrySubmit");
  const cancelButton = document.querySelector(".countryCancel");

  // Add click event listener to the Submit button
  submitButton.addEventListener("click", function () {
    // Code to execute when the Submit button is clicked
    countryConfig.classed("open", false);
    countryConfig.classed("closed", true);
  });

  // Add click event listener to the Cancel button
  cancelButton.addEventListener("click", function () {
    // Code to execute when the Cancel button is clicked
    countryConfig.classed("open", false);
    countryConfig.classed("closed", true);
  });


}
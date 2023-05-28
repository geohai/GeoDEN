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
  
  // Save the container for the whole window, the editer window, the tree container, and the title in the div
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
        console.log(category)
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

    // Set the category name
    categoryTitle.attr("value", category.name);
  }

  /*Title Input*/

  // save the Title
  let titleChange = "";

  // On submit (Enter key press), check the value and change the activeYear to the input value
  categoryTitle.on("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault(); // prevent form from submitting

      // Get input value
      let value = categoryTitle.property("value");

      titleChange = value;
    }
  });

  // On blur (focus lost), just show the default value
  categoryTitle.on("blur", (event) => {
    // Perform actions when the input field loses focus
    let value = categoryTitle.property("value");
    titleChange = value;
  });

  /*Exit Buttons*/

  // Get the buttons by their class name
  const submitButton = document.querySelector(".countrySubmit");
  const cancelButton = document.querySelector(".countryCancel");

  // Add click event listener to the Submit button
  submitButton.addEventListener("click", function () {
    container.selectAll("*").remove();
    // Call the function to change the category name
    changeCategoryName(category, titleChange);
    // Call the function to change the category countries
    //changeCategoryCountries(category, countriesChange);
    // Code to execute when the Submit button is clicked
    countryConfig.classed("open", false);
    countryConfig.classed("closed", true);
    updateSymbols(activeYear, (reset = true));
    initiateCategoryDivs()
  });

  // Add click event listener to the Cancel button
  cancelButton.addEventListener("click", function () {
    // Code to execute when the Cancel button is clicked
    countryConfig.classed("open", false);
    countryConfig.classed("closed", true);
  });
}

// This function changes the category name
function changeCategoryName(category, newName) {
  //console.log("Category name changed to:", newName);
  category.name = newName;
  //updateSymbols(activeYear, (reset = true));
  console.log(category);
}

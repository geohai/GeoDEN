// For each category in categoryGroups, make a div with the category name, visibility toggle, and edit button

// This function adds the starting categories
function initiateCategoryDivs() {
  // construct chart for each row of data
  allCategoryGroups.forEach((category) => {
    constructCategoryDiv(category);
  });

  createCategoryButton();
}

let tempCategory = null;
let addCategoryButton = false;

let setBoxes = (category) => {
  let localHeirarchy = countryHeirarchy_main;
  //console.log(category.countryList);
  // first, iterate through every country
  for (let i = 0; i < localHeirarchy.length; i++) {
    for (let j = 0; j < localHeirarchy[i].children.length; j++) {
      for (let l = 0; l < localHeirarchy[i].children[j].children.length; l++) {
        // if the country is in the category, check it, otherwise uncheck it
        localHeirarchy[i].children[j].children[l].checked =
          category.countryList.includes(
            localHeirarchy[i].children[j].children[l].id
          );
      }
    }
  }
  return localHeirarchy;
};

let makeTree = async (category) => {
  const categoryData = await setBoxes(category);

  let tree;
  // do something else here after firstFunction completes
  tree = new Tree("#treeContainer", {
    data: categoryData,
    closeDepth: 1,
    loaded: function () {
      this.collapseAll();
    },
    onChange: function () {
      // Countries selected
      let selectedCountries = [];
      for (let i = 0; i < this.selectedNodes.length; i++) {
        selectedCountries.push(this.selectedNodes[i].id);
      }
      //console.log(selectedCountries);
      category.countryList = selectedCountries;
      updateSymbols(activeYear, (reset = true));
    },
  });
};

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
        //console.log(category);
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
      makeTree;
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

    tempCategory = category;

    // Set the category name
    categoryTitle.attr("value", category.name);

    // Remove the tree container
    treeContainer.selectAll("*").remove();

    makeTree(category);
  }

  /* Title Inputs */

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

  /*Exit Edit Window Buttons*/

  // Get the buttons by their class name
  const closeButton = document.querySelector(".countryExitButton");

  // Add click event listener to the Cancel button
  closeButton.addEventListener("click", function () {
    // Code to execute when the Cancel button is clicked
    countryConfig.classed("open", false);
    countryConfig.classed("closed", true);
    tempCategory = null;
  });

  const categoryRemove = document.querySelector("#categoryRemove");
  // Add click event listener to the Cancel button
  categoryRemove.addEventListener("click", function () {
    const index = allCategoryGroups.indexOf(tempCategory);
    if (index !== -1) {
      tempCategory.hidden = true;
      updateSymbols(activeYear, (reset = true));
      allCategoryGroups.splice(index, 1);
      console.log(allCategoryGroups);
      
    }
    categoryContainer.selectAll("*").remove();
    initiateCategoryDivs();
    // Code to execute when the Cancel button is clicked
    countryConfig.classed("open", false);
    countryConfig.classed("closed", true);
    tempCategory = null;
  });
}

// This function changes the category name
function changeCategoryName(category, newName) {
  //console.log("Category name changed to:", newName);
  category.name = newName;
  //updateSymbols(activeYear, (reset = true));
  //console.log(category);
}

const categoryContainer = d3.select("#categoryConfig");

// This function creates the add category button.  It sets up interaction as well.
function createCategoryButton() {
  addCategoryButton = true;

  // Create a button below the last chart
  const buttonDiv = categoryContainer.append("div").attr("class", "button-div");

  // Append a button element to the button container
  buttonDiv
    .append("button")
    .attr("id", "addChart")
    .attr("class", "icon-button")
    .append("img")
    .attr("src", "img/cross.svg");

  // Add an event listener to the button
  buttonDiv.select("button").on("click", function () {
    allCategoryGroups.push({
      name: "New Category",
      hidden: false,
      countryList: [],
      dataPoints: {},
      midPoints: [],
      color: "#ffffff",
    });
    categoryContainer.selectAll("*").remove();
    initiateCategoryDivs();
  });
}

// For each category in categoryGroups, make a div with the category name, visibility toggle, and edit button

// This function adds the starting categories
function initiateCategoryDivs() {
  // construct chart for each row of data
  allCategoryGroups.forEach((category) => {
    constructCategoryDiv(category);
  });

  createCategoryButton();
}

//
let tempCategory = null;
let addCategoryButton = false;

//
let setBoxes = (category) => {
  let localHeirarchy = countryHeirarchy_main;
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

//
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
      category.countryList = selectedCountries;
      updateSymbols(activeYear, (reset = true), (resetHeatmap = true));
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
  const categoryDownload = d3.select("#categoryDownload");

  // create a new row label for each category
  const categoryDiv = container.append("div").attr("class", "categoryDiv");

  if (category.hidden == true) {
    categoryDiv.classed("hidden", true);
  } else {
    categoryDiv.classed("visible", true);
  }

  const categoryDivTitle = categoryDiv
    .append("div")
    .attr("class", "categoryTitle")
    .text(category.name);

  let eyeImg = "img/show.svg";
  let hideMessage = "Hide category";
  if (category.hidden == true) {
    eyeImg = "img/hide.svg";
    hideMessage = "Show category";
  } else {
    eyeImg = "img/show.svg";
    hideMessage = "Hide category";
  }

  // Append the eye to show visibility
  const visibilityIconVisible = (category.hidden ? "invisible" : "visible")
  const visibilityIcon = categoryDiv
    .append("button")
    .attr("class", "visibility-icon icon-button "+ visibilityIconVisible)
    .append("img")
    .attr("src", eyeImg)
    .attr("title", hideMessage);

  visibilityIcon.each(function () {
    d3.select(this.parentNode).on("click", function () {
      toggleVisibility(category);
      categoryDiv.classed("visible", !categoryDiv.classed("visible"));
      categoryDiv.classed("hidden", !categoryDiv.classed("hidden"));
    });
  });

  // Append a button for editing the category
  categoryDiv
    .append("button")
    .attr("class", "category-edit icon-button")
    .attr("title", "Edit category")
    .append("img")
    .attr("src", "img/edit.svg")
    .each(function () {
      d3.select(this.parentNode).on("click", function () {
        tempCategory = category;
        editCategory(tempCategory);
      });
    });

  // Function to handle toggle visibility button click
  function toggleVisibility(category) {
    // Toggle the 'hidden' property of the category
    category.hidden = !category.hidden;

    // Update the visibility icon based on the 'hidden' state
    const visibilityIcon = d3.select(
      categoryDiv.node().querySelector(".visibility-icon")
    );
    visibilityIcon.classed("invisible", category.hidden);
    visibilityIcon.classed("visible", !category.hidden);
    d3.select(categoryDiv._groups[0][0].childNodes[1].childNodes[0]).attr(
      "src",
      category.hidden ? "img/hide.svg" : "img/show.svg"
    );

    // Update symbols and any other necessary functionality
    updateSymbols(activeYear, true);
  }

  // Function to handle edit category button click
  function editCategory(category) {
    // Remove the 'closed' class
    countryConfig.classed("closed", false);
    // Add the 'open' class
    countryConfig.classed("open", true);

    // Set the category name
    categoryTitle.property("value", category.name);

    // Remove the tree container
    treeContainer.selectAll("*").remove();

    // Add on click event to the download button
    categoryDownload.on("click", () => callCategoryDownload(category));

    // Repopulate the tree container
    makeTree(category);
  }

  /* Title Inputs */

  // On submit (Enter key press), check the value and change the title to that value
  categoryTitle.on("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault(); // prevent form from submitting
      categoryTitle.node().blur();
    }
  });

  // On blur (focus lost), just show the default value
  categoryTitle.on("blur", (event) => {
    // Perform actions when the input field loses focus
    let value = categoryTitle.property("value");
    changeCategoryName(tempCategory, value);
  });

  /*Exit Edit Window Buttons*/

  // Get the buttons by their class name
  const closeButton = document.querySelector("#countryExitButton");

  // Add click event listener to the Cancel button
  closeButton.addEventListener("click", function () {
    if (tempCategory !== null) {
      // Code to execute when the Cancel button is clicked
      countryConfig.classed("open", false);
      countryConfig.classed("closed", true);
    }
    tempCategory = null;
  });

  const categoryRemove = document.querySelector("#categoryRemove");
  // Add click event listener to the Cancel button
  categoryRemove.addEventListener("click", function () {
    const index = allCategoryGroups.indexOf(tempCategory);
    if (index !== -1) {
      // Filter out the elements within "countryConfig" and its children
      const filteredElements = Array.from(container.selectAll("*")).filter(
        function (element) {
          return !element.closest("#countryConfig");
        }
      );
      filteredElements.forEach((element) => {
        element.remove();
      });
      //elementsToRemove.forEach((element) => { element.remove(); });
      tempCategory.hidden = true;
      updateSymbols(activeYear, (reset = true));
      allCategoryGroups.splice(index, 1);
      initiateCategoryDivs();
      // Code to execute when the Cancel button is clicked
      countryConfig.classed("open", false);
      countryConfig.classed("closed", true);
    }
    tempCategory = null;
  });
}

// This function changes the category name
function changeCategoryName(category, newName) {
  category.name = newName;
  const filteredElements = Array.from(categoryContainer.selectAll("*")).filter(
    function (element) {
      return !element.closest("#countryConfig");
    }
  );
  filteredElements.forEach((element) => {
    element.remove();
  });
  initiateCategoryDivs();
  // Update symbols and any other necessary functionality
  updateSymbols(activeYear, true);
}

const categoryContainer = d3.select("#categoryConfig");

let newCategoryInt = 1;

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

  const buildEmptyEvents = () => {
    let emptyEvents = {};
    for (let i = 1943; i <= 2020; i++) {
      emptyEvents[i] = { 1: 0, 2: 0, 3: 0, 4: 0 };
    }
    return emptyEvents;
  };

  const emptyEvents = buildEmptyEvents();

  // Add an event listener to the button
  buttonDiv.select("button").on("click", function () {
    allCategoryGroups.push({
      name: "NewCategory_" + newCategoryInt++,
      hidden: false,
      countryList: [],
      dataPoints: {},
      midPoints: [],
      color: "#ffffff",
      allTimeEvents: emptyEvents,
    });
    //categoryContainer.selectAll("*").remove();
    // Filter out the elements within "countryConfig" and its children
    const filteredElements = Array.from(
      categoryContainer.selectAll("*")
    ).filter(function (element) {
      return !element.closest("#countryConfig");
    });
    filteredElements.forEach((element) => {
      element.remove();
    });
    initiateCategoryDivs();
    updateSymbols(activeYear, (resetHeatmap = true));
  });
}

// This function sets up the config toggle screw and interaction.
const r = document.querySelector(":root");

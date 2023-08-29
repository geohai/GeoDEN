"use strict";

helpWindowMain();

function helpWindowMain() {
  // Define our 3 elements as constant variables
  const helpIcon = document.getElementById("helpIcon_main");
  const helpWindow = document.getElementById("helpWindow_main");

  // Create bool to store if the help prompt is open, and set it to false
  let isOpen = false;
  // Create a string to hold all the written content in
  let helpWindowContent = "";

  // Create an event listener to check if the user has clicked on the help prompt icon
  helpIcon.addEventListener("click", function () {
    // Give toggle the helpWindow to have closed class
    helpWindow.classList.toggle("closed");
    helpWindow.classList.toggle("open");
    // If the prompt was open, close it by changing the icon,
    //      moving the promp below the background, and setting isOpen as false
    if (isOpen === true) {
      helpIcon.innerHTML = "?<span class='tooltip'>Help</span>";
      helpWindow.style.zIndex = -2;
      isOpen = false;
      //make yellow
      helpIcon.style.backgroundColor = "rgb(255, 217, 0)";
      helpIcon.style.color = "black";
      // empty the window of its contents
      helpWindow.innerHTML = "";
    } else {
      helpIcon.innerHTML = "X";
      helpWindow.style.zIndex = 9998;
      isOpen = true;
      //make red
      helpIcon.style.backgroundColor = "rgb(214, 79, 79)";
      helpIcon.style.color = "black";
      // set the window to have contents
      helpWindow.innerHTML = helpWindowContent;
      makeTutorialPage();
    }
  });

  // On mouse over, set the icon to reflect that
  helpIcon.addEventListener("mouseover", function () {
    if (isOpen) {
      //make red
      helpIcon.style.backgroundColor = "rgb(214, 79, 79)";
      helpIcon.style.color = "black";
    } else {
      //make yellow
      helpIcon.style.backgroundColor = "rgb(255, 217, 0)";
      helpIcon.style.color = "black";
    }
  });

  // On mouse out, set the icon back to normal
  helpIcon.addEventListener("mouseout", function () {
    if (isOpen) {
      //make white
      helpIcon.style.backgroundColor = "white";
      helpIcon.style.color = "black";
    } else {
      //make black
      helpIcon.style.backgroundColor = "white";
      helpIcon.style.color = "black";
    }
  });

  // Add text to fill the help prompt here!
  // Title
  helpWindowContent =
    "<font size='6rem' letter-spacing: 1rem;> <b>T</b>ool for </br> <b>E</b>xploratory </br> <b>A</b>nalysis of </br> <b>D</b>engue </br> <b>S</b>erotypes</i></br></font><font size='4rem'>";

  helpWindowContent +=
    "<br><small>The main dataset (1943 to 2013) comes from <a href='https://www.cell.com/trends/microbiology/fulltext/S0966-842X(13)00273-4?_returnURL=https%3A%2F%2Flinkinghub.elsevier.com%2Fretrieve%2Fpii%2FS0966842X13002734%3Fshowall%3Dtrue' target='_blank'><em>Messina et al. 2014</em></a></br>Data from 2014 to 2020 does not have global scope.</small>";

  helpWindowContent += "<br><br><b>Keybindings:</b>";
  helpWindowContent +=
    "<br><span class='keybindings'>⎵ <small> Space:</span> Pause / Play</small>";
  helpWindowContent +=
    "<br><span class='keybindings'>→ <small> Right:</span> Next Year</small>";
  helpWindowContent +=
    "<br><span class='keybindings'>← <small> Left:</span> Previous Year</small>";/*
  helpWindowContent +=
    "<br><span class='keybindings'>↑ <small> Up:</span> Add Delay</small>";
  helpWindowContent +=
    "<span class='keybindings'><br>↓ <small> Down:</span> Subtract Delay</small>";*/

  helpWindowContent +=
    "<br><br><br><b>Credits:</b>" + "<small><br>Aidan Marler";
  helpWindowContent +=
    "<br>Dr. Yannik Roell" +
    "<br>Dr. Thomas Jaenisch" +
    "<br>Dr. Morteza Karimzadeh</font></small>";
  helpWindowContent +=
    "<br><br><font size='2rem'> and a special thanks to</font><br><font size='4rem'>Dr. Janey Messina</font>";
  helpWindowContent +=
    "<div id = 'tutorial_help' class='tutorial T_help'></div>";
}

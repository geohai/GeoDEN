'use strict';

helpWindowMain()

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
        // If the prompt was open, close it by changing the icon, 
        //      moving the promp below the background, and setting isOpen as false
        if (isOpen === true) {
            helpIcon.innerHTML = "?"
            helpWindow.style.zIndex = (-2);
            isOpen = false;
            //make yellow
            helpIcon.style.backgroundColor = "rgb(255, 217, 0)";
            helpIcon.style.borderColor = "rgb(255, 217, 0)";
            // empty the window of its contents
            helpWindow.innerHTML = "";
        } else {
            helpIcon.innerHTML = "X"
            helpWindow.style.zIndex = (9998);
            isOpen = true;
            //make red
            helpIcon.style.backgroundColor = "rgb(214, 79, 79)"
            helpIcon.style.borderColor = "rgb(214, 79, 79)"
            // set the window to have contents
            helpWindow.innerHTML = helpWindowContent;
        };
    });

    // On mouse over, set the icon to reflect that
    helpIcon.addEventListener("mouseover", function () {
        if (isOpen) {
            //make red
            helpIcon.style.backgroundColor = "rgb(214, 79, 79)"
            helpIcon.style.borderColor = "rgb(214, 79, 79)"
        } else {
            //make yellow
            helpIcon.style.backgroundColor = "rgb(255, 217, 0)";
            helpIcon.style.borderColor = "rgb(255, 217, 0)"
        }

    });

    // On mouse out, set the icon back to normal
    helpIcon.addEventListener("mouseout", function () {
        helpIcon.style.backgroundColor = "white";
        helpIcon.style.borderColor = "white"
    });


    // Add text to fill the help prompt here!
    // Title
    helpWindowContent = "<b><font size='6vmin'>Dengue Fever</b></br> 1943-2013</font>" 
    
    helpWindowContent += "<br><br><br>The dataset visualized is <a href='https://www.cell.com/trends/microbiology/fulltext/S0966-842X(13)00273-4?_returnURL=https%3A%2F%2Flinkinghub.elsevier.com%2Fretrieve%2Fpii%2FS0966842X13002734%3Fshowall%3Dtrue' target='_blank'><em>Messina et al. 2014</em></a>"

    helpWindowContent += "<br><br><br><b>Keybindings:</b>"
    helpWindowContent += "<br>Space: pause/play" + "<br>Up Arrow: Speed-Up Animation" + "<br>Down Arrow: Slow-Down Animation"
    helpWindowContent +="<br>Right Arrow: Show Next Year" + "<br>Left Arrow: Show Previous Year"
    
    helpWindowContent += "<br><br><br> This website was made by Aidan Marler with the help of:"
    helpWindowContent += "<br>Yannik Roell" + "<br>Dr. Thomas Jaenisch" + "<br>Dr. Morteza Karimzadeh"
}

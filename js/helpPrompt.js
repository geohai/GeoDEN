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
    helpWindowContent = "<b><font size='6rem'>Dengue Fever</b></br> 1943-2013</font><font size='4rem'>" 
    
    helpWindowContent += "<br><br><br><small>The dataset visualized is <a href='https://www.cell.com/trends/microbiology/fulltext/S0966-842X(13)00273-4?_returnURL=https%3A%2F%2Flinkinghub.elsevier.com%2Fretrieve%2Fpii%2FS0966842X13002734%3Fshowall%3Dtrue' target='_blank'><em>Messina et al. 2014</em></a></small>"

    helpWindowContent += "<br><br><br><b>Keybindings:</b>"
    helpWindowContent += "<br><span class='keybindings'>⎵ <small>Space:</span> pause/play</small>"
    helpWindowContent += "<br><span class='keybindings'>↑ <small>Up Arrow:</span> Speed-Up Animation</small>" 
    helpWindowContent +="<span class='keybindings'><br>↓ <small>Down Arrow:</span> Slow-Down Animation</small>"
    helpWindowContent +="<br><span class='keybindings'>→ <small>Right Arrow:</span> Show Next Year</small>" 
    helpWindowContent +="<br><span class='keybindings'>← <small>Left Arrow:</span> Show Previous Year</small>"

    helpWindowContent += "<br><br><br><b>Credits:</b>" + "<small><br>Aidan Marler"
    helpWindowContent += "<br>Yannik Roell" + "<br>Dr. Thomas Jaenisch" + "<br>Dr. Morteza Karimzadeh</font></small>" 
    helpWindowContent += "<br><br><font size='2rem'> and a special thanks to</font><br><font size='4rem'>Dr. Janey Messina</font>"
}

// Define my tutorial slides
const tutorialData = [
    {
        title: 'Welcome',
        textContent: 'TEA-DS is the Tool for Exploratory Analysis of Dengue Serotypes. With this tool, you can look at reports of dengue fever accross the world from 1943 to 2020.',
        pictureContent: 'img/point.svg'
    },
    {
        title: 'Title 2',
        textContent: 'Text content 2',
        pictureContent: 'Picture content 2'
    },
    {
        title: 'Title 3',
        textContent: 'Text content 3',
        pictureContent: 'Picture content 3'
    }
];

let currentTutorial = 0;

// Function to construct the tutorial page
function makeTutorialPage() {
    // Find a div with the class of "tutorial" and append the following:
    const tutorials = document.querySelectorAll('.tutorial');

    // Loop through the tutorials and add the elements
    for (let i = 0; i < tutorials.length; i++) {
        const tutorial = tutorials[i];

        // Create the elements to append
        const title = document.createElement('p');
        const textContent = document.createElement('div');
        const pictureContent = document.createElement('div');
        const previousButton = document.createElement('button');
        const nextButton = document.createElement('button');

        // Add the text to the elements
        title.textContent = 'Title';
        textContent.textContent = 'Text content';
        pictureContent.textContent = 'Picture content';

        // Set the arrow images as innerHTML for the buttons
        previousButton.innerHTML = '<img src="img/arrow_left.svg" alt="Previous">';
        nextButton.innerHTML = '<img src="img/arrow_right.svg" alt="Next">';
        previousButton.title = 'Previous';
        nextButton.title = 'Next';

        // Append the classes to the elements
        title.classList.add('tutorial__title');
        textContent.classList.add('tutorial__textContent');
        pictureContent.classList.add('tutorial__pictureContent');
        previousButton.classList.add('tutorial__previousButton');
        nextButton.classList.add('tutorial__nextButton');
        previousButton.classList.add('tutorial__button');
        nextButton.classList.add('tutorial__button');

        // Append the elements to the tutorial element
        tutorial.appendChild(title);
        tutorial.appendChild(textContent);
        tutorial.appendChild(pictureContent);
        tutorial.appendChild(previousButton);
        tutorial.appendChild(nextButton);
    }

    // Function to set contents to the proper slides contents
    function showTutorial(tutorial, data) {
        const title = tutorial.querySelector('.tutorial__title');
        const textContent = tutorial.querySelector('.tutorial__textContent');
        const pictureContent = tutorial.querySelector('.tutorial__pictureContent');
        title.textContent = data.title;
        textContent.textContent = data.textContent;
        pictureContent.textContent = data.pictureContent;
    }

    // Function to show the next slide
    function showNextTutorial() {
        currentTutorial = (currentTutorial + 1) % tutorialData.length;
        showTutorial(tutorials[0], tutorialData[currentTutorial]);
    }

    // Function to show the previous slide
    function showPreviousTutorial() {
        currentTutorial = (currentTutorial - 1 + tutorialData.length) % tutorialData.length;
        showTutorial(tutorials[0], tutorialData[currentTutorial]);
    }

    // Loop through the tutorials and add the event listeners
    for (let i = 0; i < tutorials.length; i++) {
        const tutorial = tutorials[i];
        showTutorial(tutorial, tutorialData[currentTutorial]);

        const previousButton = tutorial.querySelector('.tutorial__previousButton');
        previousButton.addEventListener('click', showPreviousTutorial);

        const nextButton = tutorial.querySelector('.tutorial__nextButton');
        nextButton.addEventListener('click', showNextTutorial);
    }
}

makeTutorialPage();



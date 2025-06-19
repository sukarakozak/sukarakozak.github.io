// script.js
// New User Name Variable
let userName = '';



/**
 * Calculates the appropriate skincare routine based on user selections.
 * @returns {string[]} An array of routine steps.
 */
function getRoutine() {
    let routine = [];

    // Base routine for morning/evening
    if (timeOfDay === 'Morning') {
        routine.push('Cleanser');
        routine.push('Toner');

        // Add acne treatment if needed
        if (hasAcne === 'Yes') {
            routine.push('Acne cream/serum');
        }

        // Moisturizer based on skin type for morning
        if (skinType === 'Oily') {
            routine.push('Light moisturizer');
        } else { // Dry, Combination, Sensitive
            routine.push('Moisturizer'); // General moisturizer for other types
        }

        // SPF based on weather and going outside
        if (weather === 'Sunny' || goingOutside === 'Yes') {
            routine.push('SPF 50 sunscreen');
        } else if (weather === 'Cloudy') {
            routine.push('SPF 30 sunscreen');
        }

    } else { // Evening
        // Cleanser based on skin type for evening
        if (skinType === 'Dry') {
            routine.push('Oil-based cleanser');
        } else {
            routine.push('Cleanser');
        }

        // Add acne treatment if needed
        if (hasAcne === 'Yes') {
            routine.push('Acne treatment serum');
        }

        routine.push('Serum');
        routine.push('Night moisturizer');
        routine.push('Eye cream');
    }
    return routine;
}

// Get references to HTML elements
const steps = ['step0', 'step1', 'step2', 'step3', 'step4', 'step5']; // Added step5
let currentStepIndex = 0; // Tracks the current question step

// User selections
let skinType = '';
let timeOfDay = '';
let goingOutside = '';
let weather = '';
let hasAcne = '';

// Element references
const nextBtn = document.getElementById('nextBtn');
const restartBtn = document.getElementById('restartBtn');
const validationMessageDiv = document.getElementById('validationMessage');
const resultsDiv = document.getElementById('results');
const routineList = document.getElementById('routineList');

// Add event listeners
nextBtn.addEventListener('click', handleNextStep);
restartBtn.addEventListener('click', resetApp);


// Initialize the app by showing the first step
showStep(currentStepIndex);

/**
 * Shows the specified question step and hides others.
 * @param {number} index - The index of the step to show.
 */
function showStep(index) {
    // Hide all steps first
    steps.forEach((stepId, idx) => {
        const stepElement = document.getElementById(stepId);
        if (idx === index) {
            stepElement.classList.remove('hidden');
            stepElement.classList.add('active'); // Add active class for transition
        } else {
            stepElement.classList.add('hidden');
            stepElement.classList.remove('active');
        }
    });

    // No longer updating question titles with user name

    // Hide results and restart button initially
    resultsDiv.classList.add('hidden');
    restartBtn.classList.add('hidden');
    nextBtn.classList.remove('hidden'); // Ensure next button is visible for questions
    validationMessageDiv.classList.add('hidden'); // Hide any previous validation messages
}

/**
 * Handles the click event for the 'İleri' (Next) button.
 * Validates the current step's input and moves to the next step or calculates routine.
 */
function handleNextStep() {
    const currentQuestionId = steps[currentStepIndex];
    const currentQuestionDiv = document.getElementById(currentQuestionId);

    if (currentStepIndex === 0) {
        // Handle name input step
        userName = document.getElementById('userNameInput').value.trim();
        if (!userName) {
            validationMessageDiv.classList.remove('hidden');
            return; // Stop if name is not entered
        } else {
            validationMessageDiv.classList.add('hidden');
        }
    } else {
        // Handle radio button steps
        const questionName = currentQuestionDiv.querySelector('input[type="radio"]').name; // Get the name of the radio group
        const selectedOption = document.querySelector(`input[name="${questionName}"]:checked`);

        // Validate if an option is selected for the current question
        if (!selectedOption) {
            validationMessageDiv.classList.remove('hidden'); // Show validation message
            return; // Stop execution if no option is selected
        } else {
            validationMessageDiv.classList.add('hidden'); // Hide validation message if valid
        }

        // Store the selected value based on the question
        switch (questionName) {
            case 'hasAcne':
                hasAcne = selectedOption.value;
                break;
            case 'skinType':
                skinType = selectedOption.value;
                break;
            case 'timeOfDay':
                timeOfDay = selectedOption.value;
                break;
            case 'goingOutside':
                goingOutside = selectedOption.value;
                break;
            case 'weather':
                weather = selectedOption.value;
                break;
        }
    }

    // Move to the next step
    currentStepIndex++;

    // Special logic: if user answered "No" to going outside, skip weather question
    if (currentStepIndex === 5 && goingOutside === 'No') { // Corrected index
        // Skip weather question and go directly to results
        calculateAndDisplayRoutine();
        nextBtn.classList.add('hidden'); // Hide 'Next' button
        restartBtn.classList.remove('hidden'); // Show 'Restart' button
        return;
    }

    // If there are more steps, show the next one
    if (currentStepIndex < steps.length) {
        showStep(currentStepIndex);
    } else {
        // All questions answered, calculate and display the routine
        calculateAndDisplayRoutine();
        nextBtn.classList.add('hidden'); // Hide 'Next' button
        restartBtn.classList.remove('hidden'); // Show 'Restart' button
    }
}

/**
 * Calculates the appropriate skincare routine based on user selections.
 * @returns {string[]} An array of routine steps.
 */


/**
 * Displays the calculated skincare routine in the results section.
 */
function calculateAndDisplayRoutine() {
    const finalRoutine = getRoutine();

    // Update the results title with personalized greeting
    const resultsTitle = document.querySelector('#results h2');
    resultsTitle.textContent = `Hello ${userName}! Here's your personalized routine:`;

    // Clear previous routine items
    routineList.innerHTML = '';

    // Add each routine step to the list
    finalRoutine.forEach(step => {
        const listItem = document.createElement('li');
        listItem.className = "py-1 flex items-center"; // Tailwind classes for styling
        listItem.innerHTML = `<span class="inline-block w-2 h-2 bg-teal-500 rounded-full mr-3"></span> ${step}`;
        routineList.appendChild(listItem);
    });

    // Hide all question steps when showing results
    steps.forEach(stepId => {
        const stepElement = document.getElementById(stepId);
        stepElement.classList.add('hidden');
        stepElement.classList.remove('active');
    });

    // Show the results section with animation
    resultsDiv.classList.remove('hidden');
    resultsDiv.classList.add('active'); // Trigger CSS animation
}

// Function removed - no longer updating question titles with user name

/**
 * Resets the application to its initial state.
 */
function resetApp() {
    // Reset variables
    userName = '';
    skinType = '';
    timeOfDay = '';
    goingOutside = '';
    weather = '';
    hasAcne = '';
    currentStepIndex = 0;

    // Clear name input and all radio button selections
    document.getElementById('userNameInput').value = '';
    document.querySelectorAll('input[type="radio"]').forEach(radio => {
        radio.checked = false;
    });

    // Question titles remain unchanged since we're not modifying them anymore

    // Hide results and show the first step
    resultsDiv.classList.add('hidden');
    resultsDiv.classList.remove('active'); // Remove active class for results animation
    showStep(currentStepIndex);

    // Update button visibility
    nextBtn.classList.remove('hidden');
    restartBtn.classList.add('hidden');
}
/* Variables definition */

let body = document.body;
let inForm = document.querySelector('#calculator');
let inputs = document.querySelectorAll('.input-control');
let inWeight = document.querySelector('#weight');
let inHeight = document.querySelector('#height');
let modal = document.querySelector('#modal');
let resultHead = document.querySelector('#result-head');
let resultDesc = document.querySelector('#result-desc');
let btnClose = document.querySelector('#btn-close');
let mathError = false;


/* BMI counting */

function countBMI(weight, height) {
    let result;

    if (weight > 0 && height > 0) {
        result = weight / (height * height);
        result = parseFloat(result).toFixed(2);
    } else {
        result = 'Error';
        mathError = true;
    }

    return result;
}


/* Preparing of messages based on BMI factor */

function prepareResults(countedBmi) {
    let results, head, desc, bodyClass;

    head = countedBmi;

    if (mathError) {
        desc = 'Check your data!';
        bodyClass = 'alert';
        mathError = false;
    } else {
        if (countedBmi > 30) {
            desc = 'You are REALLY too fat!';
            bodyClass = 'alert';
        } else if (countedBmi <= 30 && countedBmi >= 25) {
            desc = 'You are a bit too fat...';
            bodyClass = 'warning';
        } else if (countedBmi < 25 && countedBmi >= 18.5) {
            desc = 'Your weight is OK!';
            bodyClass = 'success';
        } else if (countedBmi < 18.5) {
            desc = 'You are too skinny...';
            bodyClass = 'alert';
        }
        desc += "<br>The correct BMI is 18.5 - 24.99.";
    }

    results = [head, desc, bodyClass];

    return results;
}


/* Sliding in the results page */

function showResults(results) {
    resultHead.innerHTML = results[0];
    resultDesc.innerHTML = results[1];

    body.classList.add('animated');
    modal.classList.add(results[2]);
    modal.classList.remove('hidden');
    modal.classList.add('slideInLeft');
}


/* Hiding the results page */

function hideResults() {
    modal.classList.remove('slideInLeft');
    modal.classList.add('slideOutRight');
    setTimeout(function () {
        modal.className = 'hidden';
        body.classList.remove('animated');
    }, 300);
}


/* Moving of the placeholders after activating the inputs */

inputs.forEach(function (el) {
    el.addEventListener('focus', function (ev) {
        let label = el.previousElementSibling;
        label.classList.add('moved');
    });

    el.addEventListener('blur', function (ev) {
        if (el.value.length === 0) {
            let label = el.previousElementSibling;
            label.classList.remove('moved');
        }
    });
});


/* Watching for the clicking of the Close button */

btnClose.addEventListener('click', function () {
    hideResults();
});


/* Watching for data from inputs and getting the answer */

inForm.addEventListener('submit', function (ev) {
    let weight, height, bmi, description;

    ev.preventDefault();

    weight = inWeight.value;
    height = inHeight.value / 100;

    bmi = countBMI(weight, height);
    description = prepareResults(bmi);
    showResults(description);
});
const buttons = document.querySelectorAll('.button-light');
const applyChangesButton = document.querySelector('#apply-changes');

buttons.forEach(button => {
    let isClicked = false;
    let originalBackgroundColor = button.style.backgroundColor;
    let originalBorderColor = button.style.borderColor;

    button.addEventListener('click', () => {
        isClicked = !isClicked;
        if (isClicked) {
            button.style.backgroundColor = 'grey';
            // button.style.color = 'green';
        } else {
            button.style.backgroundColor = originalBackgroundColor;
            button.style.borderColor = originalBorderColor;
        }
    });
});
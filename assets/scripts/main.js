const buttons = document.querySelectorAll('.button-light');

buttons.forEach(button => {
    let isClicked = false;
    let originalBackgroundColor = button.style.backgroundColor;
    let originalBorderColor = button.style.borderColor;

    button.addEventListener('click', () => {
        isClicked = !isClicked;
        if (isClicked) {
            button.style.backgroundColor = 'grey';
            button.style.color = theme.$primary - color;
        } else {
            button.style.backgroundColor = originalBackgroundColor;
            button.style.borderColor = originalBorderColor;
        }
    });
});
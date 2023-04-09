const colorThemes = document.querySelectorAll('[name="color"]');

const storeTheme = (theme) => {
    localStorage.setItem('theme', theme);
}

const getTheme = () => {
    const theme = localStorage.getItem('theme');
    return theme;
}

const retrieveTheme = function() {
    const activeTheme = getTheme();
    colorThemes.forEach((theme) => {
        if (theme.id === activeTheme) {
            theme.checked = true;
        }
    });
    document.documentElement.setAttribute('data-theme', activeTheme);
}

colorThemes.forEach((theme) => {
    theme.addEventListener('click', () => {
        storeTheme(theme.id);
        retrieveTheme();
    });
}); 

document.onload = retrieveTheme();
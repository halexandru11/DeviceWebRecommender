const colorThemes = document.querySelectorAll('[name="color"]');
const lightModeButton = document.querySelector('#light-btn');
const darkModeButton = document.querySelector('#dark-btn');


const storeTheme = (theme) => {
    var isLightMode = lightModeButton.classList.contains('active');
    const brightness = isLightMode ? 'light' : 'dark';
    localStorage.setItem('theme', `${brightness}/${theme}`);
}

const changeThemeBrightness = (brightness) => {
    const theme = getTheme();
    const color = theme.split('/')[1];
    localStorage.setItem('theme', `${brightness}/${color}`);
}

const getTheme = () => {
    return localStorage.getItem('theme');
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

lightModeButton.addEventListener('click', () => {
    lightModeButton.classList.add('active');
    darkModeButton.classList.remove('active');

    changeThemeBrightness('light');
    retrieveTheme();
});

darkModeButton.addEventListener('click', () => {
    darkModeButton.classList.add('active');
    lightModeButton.classList.remove('active');

    changeThemeBrightness('dark');
    retrieveTheme();
});

colorThemes.forEach((theme) => {
    theme.addEventListener('click', () => {
        storeTheme(theme.id);
        retrieveTheme();
    });
}); 

document.onload = retrieveTheme();
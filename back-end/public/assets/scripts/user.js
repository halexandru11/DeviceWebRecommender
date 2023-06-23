// Check if the 'userJwt' cookie exists
const hasUserJwtCookie = document.cookie.includes('jwt');

// Get the button element
const userButton = document.getElementById('userButton');

// Check if the 'userJwt' cookie exists and make the button visible
if (hasUserJwtCookie) {
    userButton.style.display = 'block';
} else {
    userButton.style.display = 'none';
}
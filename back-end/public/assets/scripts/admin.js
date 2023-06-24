const hasAdminJwtCookie = document.cookie.includes('adminJwt');

const adminButton = document.querySelector('.adminButton');

if (hasAdminJwtCookie) {
  adminButton.style.display = 'block';
} else {
  adminButton.style.display = 'none';
}

const field = document.getElementById('username');

field.addEventListener('onchange', async () => {
  console.log('field: ', field.value);
});

console.log('signin.js loaded');

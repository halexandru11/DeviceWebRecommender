function getFilters() {
  const url = window.location.href;
  const index = url.indexOf('=');
  const character = url.charAt(index + 1);
  console.log(character);

  const data = { character };
  //const token = localStorage.getItem('token');

  fetch('/products/product=[0-9]+', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
    .then((response) => {
      console.log(response);
      if (response.ok) {
        console.log('success');
      } else {
        console.log('error');
      }
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}

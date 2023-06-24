function getFilters() {
  console.log('getting filters');
  const filters = JSON.parse(localStorage.getItem('selectedFilters')) || [];
  console.log('filters: ', filters);
  const data = { filters };

  fetch('/products/filters', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
    .then((response) => {
      console.log(response);
      if (response.ok) {
        console.log('filters success');
      } else {
        console.log('filters error');
      }
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}

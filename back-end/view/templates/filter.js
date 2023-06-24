async function getFilters() {
  console.log('getting filters');
  const filters = JSON.parse(localStorage.getItem('selectedFilters')) || [];
  console.log('filters: ', filters);
  const filtersString = filters.join(',');

  const url = `/api/filters=${filtersString}`;
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ filters }),
  });
}

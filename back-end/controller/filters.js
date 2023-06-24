export function getFilters(req, res) {
  const url = req.url;
  const filtersString = url.split('=')[1]; // example.com/filters=black,apple,red
  const filters = filtersString.split(',');
  res.statusCode = 200;
  res.end(JSON.stringify({ filters }));
}

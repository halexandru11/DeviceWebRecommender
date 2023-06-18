export const handleFiltersRequest = (req, res) => {

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Filters request handled successfully' }));
};
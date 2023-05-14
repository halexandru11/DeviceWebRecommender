import http from 'http';
const fs = require('fs');
const path = require('path')
require('dotenv').config()

const getContentType = (extname) => {
  let contentType = 'text/html';
  switch (extname) {
    case '.js':
      contentType = 'text/javascript';
      break;
    case '.css':
      contentType = 'text/css';
      break;
    case '.json':
      contentType = 'application/json';
      break;
    case '.png':
      contentType = 'image/png';
      break;
    case '.jpg':
      contentType = 'image/jpg';
      break;
  }
  return contentType;
}

const server = http.createServer((req, res) => {
  let filePath = `.${req.url}`;

  const extname = path.extname(filePath);
  const contentType = getContentType(extname);

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404);
      res.write('Error: Not found!');
    }
    else {
      res.writeHead(200, {
        'Content-Type': contentType
      });
      res.write(data);
    }

    res.end()
  })
});

const port = process.env.PORT || 3000;

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

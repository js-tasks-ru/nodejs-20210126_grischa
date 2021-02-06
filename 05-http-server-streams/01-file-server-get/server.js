const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');

const server = new http.Server();

server.on('request', (req, res) => {
  const pathname = url.parse(req.url).pathname.slice(1);
  if (pathname.indexOf(path.sep) !== -1) {
    res.statusCode = 400;
    res.end('Nested path error');
    return;
  }
  console.log('sdsd');

  const filepath = path.join(__dirname, 'files', pathname);
  switch (req.method) {
    case 'GET':
      const stream = fs.createReadStream(filepath);
      stream.pipe(res);

      stream.on('error', (error) => {
        if (error.code === 'ENOENT') {
          res.statusCode = 404;
          res.end(`File ${filepath} not found`);
        } else {
          res.statusCode = 500;
          res.end('Server error');
        }
      });

      req.on('aborted', () => {
        stream.destroy();
      });
      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;

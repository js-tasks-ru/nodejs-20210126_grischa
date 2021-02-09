const LimitSizeStream = require('./LimitSizeStream');
const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');

const server = new http.Server();

server.on('request', (req, res) => {
  const pathname = url.parse(req.url).pathname.slice(1);
  const filepath = path.join(__dirname, 'files', pathname);

  if (pathname.indexOf(path.sep) !== -1) {
    res.statusCode = 400;
    res.end('Nested path error');
    return;
  }
  if (fs.existsSync(filepath) === true) {
    res.statusCode = 409;
    res.end(`File ${filepath} already exists`);
    return;
  }

  switch (req.method) {
    case 'POST':
      const limit = Math.pow(1024, 2);
      const limitSizeStream = new LimitSizeStream({limit});
      req.pipe(limitSizeStream).pipe(fs.createWriteStream(filepath));

      req.on('end', () => {
        res.statusCode = 201;
        res.end('Ok');
      });
      req.on('aborted', () => {
        fs.unlinkSync(filepath);
      });
      req.on('error', (error) => {
        res.statusCode = 500;
        res.end('Server error');
      });
      limitSizeStream.on('error', (error) => {
        fs.unlinkSync(filepath);
        if (error.code === 'LIMIT_EXCEEDED') {
          res.statusCode = 413;
          res.end(`File size limit of ${limit} exceeded.`);
        } else {
          res.statusCode = 500;
          res.end('Server error');
        }
      });
      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;

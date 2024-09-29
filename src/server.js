const http = require('node:http');
const fs = require('fs');
const path = require('path');
const player = require('./player');
const { HTTP_STATUS, respondWith } = require("./defs");

const HOSTNAME = '127.0.0.1';
const PORT = 3000;

// ----------------------------------------------------------------------------

// Serve static files based on the requested path
function serveStaticFile(filePath, response) {
  let contentType = 'text/plain';

  switch (path.extname(filePath)) {
    case '.html':
      contentType = 'text/html';
      break;
    case '.js':
      contentType = 'application/javascript';
      break;
  }

  fs.readFile(filePath, (err, data) => {
    if (err) {
      respondWith(response, HTTP_STATUS.INTERNAL_SERVER_ERROR, `Error loading file: ${err}`);
      return;
    }
    respondWith(response, HTTP_STATUS.OK, data, contentType);
  });
}

function requestHandler(request, response) {
  const { url } = request;

  if (url === "/" || url === "/index.html" || url === "/stress") {
    serveStaticFile('public/index.html', response);
  } else if (url.startsWith("/scripts/")) {
    serveStaticFile(path.join('public', url), response); // Use path.join for better cross-platform compatibility
  } else if (url === "/alldata") {
    player.serveAllData(response);
  } else if (url.startsWith("/callit-_-")) {
    player.handleMovement(request, response);
  } else {
    respondWith(response, HTTP_STATUS.NOT_FOUND, `${HTTP_STATUS.NOT_FOUND}: Page Not Found`);
  }
}

// Create and start the server
const server = http.createServer(requestHandler);
server.listen(PORT, HOSTNAME, function() {
  console.log(`Server running at http://${HOSTNAME}:${PORT}/`);
});


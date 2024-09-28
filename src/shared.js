const HTTP_STATUS = {
  OK: 200,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500
};

function respondWith(response, statusCode, message = '', contentType = 'text/plain') {
  response.statusCode = statusCode;
  response.setHeader('Content-Type', contentType);
  response.end(message);
}

module.exports = {
  HTTP_STATUS,
  respondWith
};

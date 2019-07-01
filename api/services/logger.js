const logger = (_req, _res, _next) => {
  if (process.env.DEV) {
    console.log(
      '\n',
      _req.method,
      _req.method === 'GET' ? _req.url.split('?', 1)[0] : _req.url,
      _req.method === 'GET' ? _req.query : _req.body,
      '\n'
    );
  }
  _next();
};

module.exports = logger;

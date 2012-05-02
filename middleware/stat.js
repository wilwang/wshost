var statsd = new (require('node-statsd').StatsD)(
	process.env.STATSD_HOST || 'localhost',
	process.env.STATSD_PORT || 8125
);

module.exports = function stat() {
  return function statRequest(req, res, next) {
    var endpoint = req.url.replace(/^\/([^\/]*).*$/, '$1');    

    statsd.increment('endpoint.ConfigurationService.' + endpoint);
    statsd.timing('endpoint.ConfigurationService.' + endpoint, (new Date - req._startTime));

    next();
  };
};
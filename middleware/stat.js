var statsd = new (require('node-statsd').StatsD)(
	process.env.STATSD_HOST || 'localhost',
	process.env.STATSD_PORT || 8125
);

module.exports = function(service) {
  this.service = service;

  return function(req, res, next) {
    var endpoint = req.url.replace(/^\/([^\/]*).*$/, '$1');    

    statsd.increment('endpoint.' + service._meta.name + '.' + endpoint);
    statsd.timing('endpoint.' + service._meta.name + '.' + endpoint, (new Date - req._startTime));

    next();
  };
};
var fs = require('fs')
  , jade = require('jade')
  , static = require('node-static')
  , UrlGenerator = require('../urlgenerator');

var fileServer = new (static.Server)('./node_modules/wshost/_doc');

module.exports = function(service) {
  this.service = service;

  return function(req, res, next) {
  	if (req.url.indexOf('/_doc') == 0) {  	  
  	  if (req.url == '/_doc') {
  	  	fs.readFile('./node_modules/wshost/_doc/template.jade', 'utf-8', function(err, template) {
  	  	  var generator = jade.compile(template);

  	  	  var locals = {
  	  	    name: service._meta.name,
  	  	    description: service._meta.description,
  	  	    endpoints: []
  	  	  };

  	  	  for (var endpoint in service) {
  	  	    if (endpoint[0] == '_') {
  	  	  	  continue;
  	  	    }

  	  	    var paths = [];
  	  	    for (var verbIndex in service[endpoint].verbs) {
  	  	  	  paths.push({ 
  	  	  	    verb: service[endpoint].verbs[verbIndex], 
  	  	  	    url: new UrlGenerator(endpoint, service[endpoint].params).generateForVerb(
  	  	  	      service[endpoint].verbs[verbIndex]
  	  	  	   	) 
  	  	  	  });
  	  	    }

  	  	    locals.endpoints.push({
  	  	  	  name: endpoint,
  	  	  	  description: service[endpoint].description,
  	  	  	  params: service[endpoint].params,
  	  	  	  paths: paths
  	  	    });
  	  	  }

  	  	  res.end(generator(locals));
  	  	});
  	  } else {
  	  	req.url = req.url.replace('/_doc', ''); // hack, but whatever
		fileServer.serve(req, res);
  	  }  	  
  	} else {
  	  next();
  	}
  };
};
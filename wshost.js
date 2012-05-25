var http = require('http')
  , connect = require('connect')
  , director = require('director')
  , UrlGenerator = require('./urlgenerator');

function parseQueryParams(queryParamString) {
	var query = new Object();

	if (queryParamString.length > 0) {
		var arrayParamPair = queryParamString.split('&');

		for (var paramPair in arrayParamPair) {
			if (arrayParamPair[paramPair].indexOf('=') >= 0) {
				var arrayPair = arrayParamPair[paramPair].split('=');

				arrayPair[1] === undefined
					? query[arrayPair[0]] = null
					: query[arrayPair[0]] = unescape(arrayPair[1]);
			}
		}
	}

	return query;
}

module.exports = function wshost(service, options) {  
  var postActionWrapper = function() {
    var key = this.req.url.replace('/', '');
    
    var params = {};
    for (var param in service[key].params) {
      params[param] = this.req.body[param];
    }

    var self = this;
    service[key].action(params, function(result) {
      self.res.end(JSON.stringify(result));
    });
  };

  var getActionWrapper = function() {
    var key = this.req.url.replace(/^\/([^\/]*).*$/, '$1');
		var routeParams;
		var queryParams = parseQueryParams(this.req._parsedUrl.query);

    // convert arguments to params object
    var params = {} , argumentIndex = 0;
    for (var param in service[key].params) {    
      params[param] = (argumentIndex < arguments.length) 
        ? arguments[argumentIndex] 
        : queryParams[param];

      argumentIndex++;
    }

    var self = this;
    service[key].action(params, function(result) {
      self.res.end(JSON.stringify(result));
    });
  };

  var createRouter = function() {
    var routes = {};

    for (var key in service) {
      // do not generate routes for methods that begin with underscore
      if (key[0] == '_') {
        continue;
      }

      if (!service[key].verbs || service[key].verbs.length == 0) {
        service[key].verbs = ['GET'];
      }  
      
      for (var verbIndex in service[key].verbs) {
        var path = new UrlGenerator(key, service[key].params).generateForVerb(
          service[key].verbs[verbIndex]
        );

        switch (service[key].verbs[verbIndex]) {
          case 'GET': {
            if (!routes[path]) {
              routes[path] = {
                get: getActionWrapper
              };
            } else {
              routes[path].get = getActionWrapper;
            }
            break;
          }

          case 'POST': {
            if (!routes[path]) {
              routes[path] = {
                post: postActionWrapper
              };
            } else {
              routes[path].post = postActionWrapper;
            }
            break;
          }

          default: {
            console.log('unrecognized verb %s', service[key].verbs[verbIndex]);
            break;
          }
        }
      }  
    }

    return new director.http.Router(routes);
  };

  var createServer = function(service, options) {
    if (!options) options = {};

    var router = createRouter(service);

    var app = connect();
    app.use(require('./middleware/doc')(service));

    if (options.stats) {      
      app.use(require('./middleware/stat')())
    }

    app.use(function(req, res) {
      req.chunks = [];
      req.on('data', function(chunk) {
        req.chunks.push(chunk);
      });

      router.dispatch(req, res, function(err) {
        if(err) {
          res.writeHead(404);
          res.end(JSON.stringify(err));
        }
      });
    });

    return http.createServer(app);
  };

  this.server = createServer(    
    service,
    options
  );

  this.listen = function(port, callback) {
    this.server.listen(port, function() {
      if (callback) { callback(); }
    });
  };

  this.close = function() {
    this.server.close();
  };
};

var http = require('http')
  , connect = require('connect')
  , director = require('director');

module.exports = function wshost(service) {
  this.service = service;

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
    
    // convert arguments to params object
    var params = {} , argumentIndex = 0;
    for (var param in service[key].params) {    
      params[param] = (argumentIndex < arguments.length) 
        ? arguments[argumentIndex] 
        : undefined;

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
      if (!service[key].verbs || service[key].verbs.length == 0) {
        service[key].verbs = ['GET'];
      }  
      
      for (var verbIndex in service[key].verbs) {
        switch (service[key].verbs[verbIndex]) {
          case 'GET': {
            var path = '/'+key;
            for (var param in service[key].params) {
              path += '/:'+param;
            }
            
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
            var path = '/'+key;

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

  this.listen = function(port) {
    var router = createRouter(this.service);

    var server = connect()
      .use(require('./middleware/stat')())
      .use(function(req, res) {
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

    server.listen(3000);
  };
};

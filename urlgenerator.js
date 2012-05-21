module.exports = function UrlGenerator(name, params) {
  this.name = name;
  this.params = params;

  var get = function(name, params) {
    var path = '/' + name;
    for (var param in params) {
			if (params[param].querystring === null || params[param].querystring === false) {
	      path += '/:' + param;
				if (!params[param].required) {
					path += '?'
				}
			}
    }

    return path;
  };

  var post = function(name) {
    return '/' + name;
  };

  this.generateForVerb = function(verb) {
    switch (verb) {
      case 'GET': {
      	return get(this.name, this.params);
      }
      case 'POST': {
      	return post(this.name);
      }
      default: {
      	return '';
      }
    }
  };
};

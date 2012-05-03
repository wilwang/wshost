var wshost = require('../wshost')
  , request = require('request')
  , testcase = require('nodeunit').testCase;

var echoService = {
  echo: {
    params: {
      message: { required: true, type: 'string' } // PARAMETER VALIDATION IS COMING SOON!
    },
    verbs: ['GET', 'POST'], // <OPTIONAL> SPECIFY VERBS TO ROUTE, DEFAULT = GET
    action: function(params, callback) {
      callback({ message: params.message });
    }
  }	
};

var host = new wshost(echoService);

exports.basic = testcase({
  setUp: function(callback) {
  	host.listen(3000, callback);
  },

  tearDown: function(callback) {
  	host.close();
    callback();
  },
  
  testGet: function(test) {
    test.expect(1);

    var options = {
  	    method : 'GET'
  	  , uri    : 'http://localhost:3000/echo/hello'
    };

    request(options, function(error, response, body) {
      test.deepEqual(JSON.parse(body), { message: 'hello' });
      test.done();
    });
  },

  testPost: function(test) {
  	test.expect(1);

    var options = {
  	    method  : 'POST'
  	  , uri     : 'http://localhost:3000/echo'  	
  	  , body    : '{ "message": "hello" }'
  	  , headers : { 'content-type': 'application/json' }
    };

    request(options, function(error, response, body) {
  	  test.deepEqual(JSON.parse(body), { message: 'hello' });
  	  test.done();
    });
  }
});
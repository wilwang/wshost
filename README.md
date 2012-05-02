# wshost

`wshost` is a generic host for exposing modules as web services in Node.js.

## Build Status

[![Build Status](https://secure.travis-ci.org/Chatham/wshost.png?branch=master)](http://travis-ci.org/Chatham/wshost)

## Usage

```javascript
var wshost = require('wshost');

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

new wshost(echoService).listen(3000);
```

## StatsD Middleware

* The host and port for your StatsD server will be pulled from the following environment variables:
  - STATSD_HOST (default = localhost)
  - STATSD_PORT (default = 8125)
* Includes connect middleware to publish the following stats about each request to your StatsD server:
	- response time
	- call count increment

## License

(The MIT License)

Copyright (c) 2012 Chatham Financial Corp <oss@chathamfinancial.com>

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
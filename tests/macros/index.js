var assert = require('assert');

var macros = exports;

macros.executeAPICalls = function (mappings) {
  
  var suite = {};
  Object.keys(mappings).forEach(function(key){
    var args = mappings[key].args,
        expected = mappings[key].expected;
    suite[key + '("' + args.join('","')+ '")'] = {
      topic: function ( _client) {
        var method = key;
        method = eval(key);
        args.push(this.callback);
        method.apply(undefined, args);
      },
      'should not error': function (err, result) {
        assert.isNull(err);
      },
      'should return valid json': function (err, res, body) {
        var result = JSON.parse(body);
        assert.isObject(result);
      },
      'should echo back arguments': function (err, res, body) {
        var result = JSON.parse(body);
        assert.isObject(result);
        assert.equal(result.url, expected.url)
        assert.equal(result.method, expected.method)
        assert.equal(result.data, expected.data)
        if(typeof expected.headers === "object") {
          Object.keys(expected.headers).forEach(function(header){
            assert.equal(result.headers[header], expected.headers[header])
          });
        }
      }
    };
  });
  return suite;
  
}
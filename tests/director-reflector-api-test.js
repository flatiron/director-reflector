/*
 * director-reflector-api-test.js: Tests for `restful` core api
 *
 * (C) 2012, Nodejitsu Inc.
 *
 */

var assert = require('assert'),
    vows = require('vows'),
    server = require('../examples/server'),
    dc = require('../lib/director-reflector');

var _server, _client;

function runRoutes () {
  var suite = {};
  Object.keys(mappings).forEach(function(key){
    var args = mappings[key].args,
        expected = mappings[key].expected;
    suite[key + '("' + args.join('","')+ '")'] = {
      topic: function () {
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
      }
    };
  });
  return suite;
}

var mappings = {

  "_client.foo"                   : { args: [], expected: { url: "/foo", method: "GET", data: null }},
  "_client.bar"                   : { args: [], expected: { url: "/bar", method: "POST", data: null }},

  "_client.moo.create"            : { args: [], expected : { url: "/moo", method: "POST", data: null }},
  "_client.moo.get"               : { args: [], expected : { url: "/moo", method: "GET", data: null }},
  "_client.moo.destroy"           : { args: [], expected : { url: "/moo", method: "DELETE", data: null }},
  "_client.moo.save"              : { args: [], expected : { url: "/moo", method: "PUT", data: null }},

  "_client.albums.create"         : { args: ['ill-communication'], expected : { url: "/albums/ill-communication", method: "POST", data: null }},
  "_client.albums.get"            : { args: ['ill-communication'], expected : { url: "/albums/ill-communication", method: "GET", data: null }},

  "_client.albums.songs.create"   : { args: ['ill-communication', 'root-down'], expected : { url: "/albums/ill-communication/songs/root-down", method: "POST", data: null }},
  "_client.albums.songs.get"      : { args: ['ill-communication', 'root-down'], expected : { url: "/albums/ill-communication/songs/root-down", method: "GET", data: null }},


  "_client.users.create"          : { args: ['bob'], expected : { url: "/users/bob", method: "POST", data: null }},
  "_client.users.get"             : { args: ['bob'], expected : { url: "/users/bob", method: "GET", data: null }},
  "_client.users.save"            : { args: ['bob'], expected : { url: "/users/bob", method: "PUT", data: null }},
  "_client.users.destroy"         : { args: ['bob'], expected : { url: "/users/bob", method: "DELETE", data: null }},

  "_client.users.eat"             : { args: ['bob'], expected : { url: "/users/bob/eat", method: "POST", data: null }},

  "_client.users.dongles.create"  : { args: ['bob', 'a-dongle'], expected : { url: "/users/bob/dongles/a-dongle", method: "POST", data: null }},
  "_client.users.dongles.get"     : { args: ['bob', 'a-dongle'], expected : { url: "/users/bob/dongles/a-dongle", method: "GET", data: null }}

};

vows.describe('director-reflector/api').addBatch({
  'When using `director-reflector`': {
    'creating a new http server with a `Director.Router` with one resource': {
      topic: function () {
        _server = server.start();
        this.callback(null, _server);
      },
      'should return a routing map': function (err, _server) {
        assert.isObject(_server);
      }
    },
    'creating a new api client': {
      topic: function () {
        _client = dc.createClient(server.router);
        this.callback(null, _client);
      },
      'should return a client': function (err, _client) {
        assert.isObject(_client);
      }
    }
  }
}).addBatch({
  'When using a Director client - ': runRoutes()
}).export(module);
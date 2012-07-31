/*
 * director-reflector-api-test.js: Tests for `restful` core api
 *
 * (C) 2012, Nodejitsu Inc.
 *
 */

var assert = require('assert'),
    vows = require('vows'),
    macros = require('./macros'),
    server = require('../examples/server'),
    dc = require('../lib/director-reflector');

var _server, _client;

var mappings = {
  "_client.foo" : { args: [], expected: { url: "/foo", method: "GET", data: null, headers : { "authorization": "Basic bWFyYWs6Zm9vZm9v" } }},
  "_client.bar" : { args: [], expected: { url: "/bar", method: "POST", data: null, headers : { "authorization": "Basic bWFyYWs6Zm9vZm9v" } }}
  };

vows.describe('director-reflector/api').addBatch({
  'When using `director-reflector`': {
    'creating a new http server with a `Director.Router` with one resource': {
      topic: function () {
        _server = server.start(8001);
        this.callback(null, _server);
      },
      'should return a routing map': function (err, _server) {
        assert.isObject(_server);
      }
    },
    'creating a new api client': {
      topic: function () {
        _client = dc.createClient(server.router, {
          port: 8001,
          username: "marak",
          password: "foofoo"
        });
        this.callback(null, _client);
      },
      'should return a client': function (err, _client) {
        assert.isObject(_client);
      },
      'with created api client' : macros.executeAPICalls(mappings)
    }
  }
}).export(module);
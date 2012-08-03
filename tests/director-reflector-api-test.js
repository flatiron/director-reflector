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

  "_client.foo"                   : { args: [], expected: { url: "/foo", method: "GET", data: null }},
  "_client.bar"                   : { args: [], expected: { url: "/bar", method: "POST", data: null }},

  "_client.moo.create"            : { args: [], expected : { url: "/moo", method: "POST", data: null }},
  "_client.moo.get"               : { args: [], expected : { url: "/moo", method: "GET", data: null }},
  "_client.moo.destroy"           : { args: [], expected : { url: "/moo", method: "DELETE", data: null }},
  "_client.moo.save"              : { args: [], expected : { url: "/moo", method: "PUT", data: null }},

  "_client.albums.create"         : { args: ['ill-communication'], expected : { url: "/albums/ill-communication", method: "POST", data: null }},
  "_client.albums.get"            : { args: ['ill-communication'], expected : { url: "/albums/ill-communication", method: "GET", data: null }},

  "_client.albums.songs.create"   : { args: ['ill-communication', 'root-down', { length: "3:32" }], expected : {
    url: "/albums/ill-communication/songs/root-down",
    method: "POST",
    data: {
      length: '3:32'
    }
   }},
  "_client.albums.songs.get"      : { args: ['ill-communication', 'root-down'], expected : {
    url: "/albums/ill-communication/songs/root-down",
    method: "GET"
  }},

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
        _server = server.start(8000);
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
      },
      'with created api client' : macros.executeAPICalls(mappings)
    }
  }
}).export(module);
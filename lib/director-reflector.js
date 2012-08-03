var client    = exports,
    utile     = require('utile'),
    traverse  = require('traverse');

client.Client = function (options) {
  var self = this;

  options = options || {};

  options.port = options.port || 8000;
  options.host = options.host || "localhost";
  self.basePath = "http://" + options.host + ':' + options.port;

  if(typeof options.username !== "undefined" && typeof options.password  !== "undefined") {
    self.authorization = utile.base64.encode(options.username + ':' + options.password);
  }

  return self;
}

client.createClient = function (router, options) {

  //
  // Intialize a new base Client class 
  //
  var _client = new client.Client(options);

  //
  // For every route in the routing table, apply the vistor method
  //
  traverse(router.routes).forEach(visitor);

  function visitor (item) {
    var path = this.path,
    pad = '',
    self = this;

    //
    // If this node has a parent, find it's siblings
    //
    if (self.parent) {
      var x = {
          siblings : this.parent.keys,
          key : this.key,
          index : this.parent.keys.indexOf(this.key)
      };
    }

    //
    // If the route has length, and is not the root, "/",
    //
    if (path.length > 0) {
      var _path = [];
      
      //
      // iterate through every part of the route,
      // replacing params regex back with slugs
      //
      // TODO: Un-hardcode the regex param here, make configurable
      //
      for (var i = 0; i < path.length; i++) {
        if(path[i] !=='([._a-zA-Z0-9-]+)') {
          if(typeof mappings[path[i]] !== 'undefined') {
            path[i] = mappings[path[i]]
          }
          _path.push(path[i]);
        }
      }

      if(x.siblings.length > 1) {
        var str = '_client["' + _path.join('"]["') + '"]';
        if(typeof eval(str) === 'undefined') {
          var args = [];
          path.forEach(function(part){
            if(part === "([._a-zA-Z0-9-]+)") {
              part = ":param";
            }
            args.push(part);
          });
          var verbs = Object.keys(item).join('/');
          str += ' = function () { _client.request("'+ args.join('/') +'", "'+ verbs +'", arguments)};';
        }
        eval(str);
      }
    }
  }
  return _client;
}

client.id = function (id) {
  return function(){};
}

var request = require('request');

client.Client.prototype.request = function (path, verbs, args) {

  var self = this;
  args = utile.args(args);
  path = path.split('/');
  verbs = verbs.split('/');

  //
  // Replace API mappings
  //
  for (var i = 0; i < path.length; i++) {
    if(typeof mappings[path[i]] !== 'undefined') {
      path[i] = mappings[path[i]];
    }
  }

  var verb = path[path.length - 1];

  //
  // Remove the HTTP verb from the route name
  //
  if(path.length > 1 && typeof mappings[verb] !== 'undefined') {
    path.pop();
  }

  //
  // Determine the HTTP verb
  //
  if(typeof mappings[verb] === 'undefined') {
    verb = verbs[0];
  }
  
  
  //
  // Merge any :params with curried arguments
  //
  var matches = [],
      sent    = [];

  //
  // Find all route parts which are parameters
  //
  for (var i = 0; i < path.length; i++) {
    if (path[i] === ":param") {
      matches.push(i);
    }
  }

  //
  // Determine all primary keys which were pass in via route or payload
  //
  for (var i = 0; i < args.length; i++) {
    if(typeof args[i] === "string") {
      sent.push(args[i])
    }
    if(typeof args[i] === "object" && typeof args[i].id !== "undefined") {
      sent.push(args[i].id);
    }
  }
  
  //
  // Replace all parameters with matched IDs
  //
  matches.forEach(function(index){
    path[index] = sent.shift();
  });

  //
  // Create the outgoing URI which will be requested
  //
  var uri = self.basePath + '/' + path.join('/'), headers = {};
  if(typeof self.authorization === 'string') {
    headers['authorization'] = "Basic " + self.authorization;
  }

  //
  // TODO: Make configurable
  //
  headers['content-type'] = "application/json";

  //
  // Determine if there are function arguments,
  // that need to be converted to HTTP request parameters
  //
  var data;
  if(typeof args[args.length -1] === 'object') {
    data = args[args.length -1];
  }

  //
  // Make an outgoing HTTP request using the `request` library
  //
  request({ uri: uri, method: verb, headers: headers, body: JSON.stringify(data) }, function(err, res, body){
    args.callback(err, res, body);
  });

};

var mappings = {
  "put" : "save",
  "save" : "put",
  "delete" : "destroy",
  "destroy" : "delete",
  "get" : "get",
  "create" : "post",
  "post" : "create"

};

//
// Helper method for serializing a Director routing map to JSON
//
client.toJSON = function (router) {
  var _routes = traverse(router.routes).clone();
  traverse(_routes).forEach(visitor);
  function visitor(item) {
    if(typeof item === "function" && this.isLeaf) {
      traverse(_routes).set(this.path, {});
    }
  }
  return JSON.stringify({ routes: _routes });
};
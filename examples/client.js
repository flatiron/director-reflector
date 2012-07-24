var dc       = require('../lib/director-client'),
    director = require('director');

var server = require('./server');

var client = dc.createClient(server.router);

//
// Generic callback handler
//
var callback = function (err, res, body) {
  if (err) {
    return console.log(err);
  }
  var result = JSON.parse(body);
  console.log(result)
};

//
// Call random method foobar
//
client.foobar(callback);

//
// Call random method foobar with some data
//
client.foobar({ cake: true }, callback);

//
// Get all users
//
client.users(callback);

//
// Create new user
//
client.users.create({ id: "bob" }, callback);

//
// Get bob 
//
client.users("bob", callback);

//
// Get bob
//
client.users.get({ id: "bob" }, callback);

//
// Update a user
//
client.users.save("bob", { "hat": true }, callback);


//
// Create a donble for bob
//
client.users.dongles.create("bob", "awesome-donble", {}, callback);


//
// Get dongles for users
//
client.users.dongles.get("bob", "awesome-donble", callback);

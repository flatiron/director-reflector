# Director-client

Reflects a node.js HTTP client API wrapper from a pre-existing [Director](http://github.com/flatiron/director) router. Requires **no** additional configuration and will work with generic `Director.Router` instances.

# Explanation

director-client removes the process of writing boilerplate client code for communicating with  [Director](http://github.com/flatiron/director) http routers. Director-client uses <a href="http://en.wikipedia.org/wiki/Reflection_(computer_programming)">reflection</a> to reflect a node.js HTTP client API wrapper which maps all routes to an appropiate object and method name and HTTP call.

Through the removal of this boilerplate code, restful creates a robust, standardized, and re-usable http interface for any [Director](http://github.com/flatiron/director) router.

**Note**: Director-client makes the least amount of assumptions possible about your application. It creates an API wrapper whose complexity is **as minimalistic as possible**. The default client which `director-client` reflects will cover all routes out of the box, but you are encouraged to extend the reflected client with your own personal sugar-syntax. 

# Features

 - Can currently output a plain-text view of a `Director.Router` instance

# Installation

     npm install director-client

## Default Mappings

If only one verb is bound to the route, the route name becomes the method name.

router.get('/foo')                          =>  client.foo()
router.post('/bar')                         =>  client.bar()

If multiple verbs are bound to the route, each verb becomes a method.

router.get('/')                             =>  client.get()
router.delete('/')                          =>  client.destroy()
router.put('/')                             =>  client.save()
router.post('/')                            =>  client.create()

router.get('/moo')                          =>  client.moo.get()
router.post('/moo')                         =>  client.moo.create()
router.delete('/moo')                       =>  client.moo.destroy()
router.put('/moo')                          =>  client.moo.save()

If route parameters are used, they become the last methods argument signature.

router.post('/albums/:albumid')             =>  client.albums.create('ill-communication', { artist: "beastie boys" })
router.get('/albums/:albumid')              =>  client.albums.get('ill-communication')

If multiple route parameters are used, then the ids curry as arguments from left-to-right.

router.post('/albums/:albumid/songs/:id')   =>  client.albums.songs.create('ill-communication', 'root-down', data)
router.get('/albums/:albumid/songs/:id')    =>  client.albums.songs.get('ill-communication', 'root-down')

Nested routing scopes follow the same rules.

router.path('/users', function(){             
  this.get(n);                              => client.users.get()
  this.post(n);                             => client.users.create()
  this.path('/:id', function(){               
    this.post(n);                           => client.users.create('bob', data)
    this.get(n);                            => client.users.get('bob')
    this.delete(n);                         => client.users.destroy('bob')
    this.put(n);                            => client.users.save('bob', data)
    this.path('/dongles', function(){
      this.post(n);                         => client.users.dongles.create('bob', 'the-dongle', data)
      this.get(n);                          => client.users.dongles('bob', 'the-dongle');
    })
  })
});

# Usage

``` js
var de       = require('director-explorer'),
    director = require('director');

var router = new director.http.Router();

// simple noop for demo
var n = function(){};

router.get('/', n);

router.path('/users/:id', function(){
  this.post(n);   
  this.get(n);    
  this.delete(n); 
  this.put(n);    
  this.path('/dongles', function(){
    this.get(n);
    this.post(n);
  })
})

console.log(de.table(router));

/* 

  OUTPUTS:

    GET     / 
    POST    /users/([._a-zA-Z0-9-]+) 
    GET     /users/([._a-zA-Z0-9-]+) 
    DELETE  /users/([._a-zA-Z0-9-]+) 
    PUT     /users/([._a-zA-Z0-9-]+) 
    GET     /users/([._a-zA-Z0-9-]+)/dongles 
    POST    /users/([._a-zA-Z0-9-]+)/dongles 

*/

```

# TODO

 - Add HTML view with collapsable menus
 - Add WSDL view
 - Create director-client project for auto-generated director clients
 - Create html demo forms and auto-documentation for director routers

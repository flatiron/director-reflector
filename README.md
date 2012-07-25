# Unreleased / Not Ready for Review

# Director-reflector

Reflects [request](https://github.com/mikeal/request) based HTTP client API wrappers for pre-existing [Director](http://github.com/flatiron/director) routers. Requires **no**  configuration and is compatible with any `Director.Router` instance.

# Explanation

Director-reflector removes the process of writing boilerplate client code for communicating with HTTP [Director](http://github.com/flatiron/director) routers. Director-reflector uses <a href="http://en.wikipedia.org/wiki/Reflection_(computer_programming)">reflection</a> to reflect an API client which maps all remote routes to a local object and method calls.

Through the removal of this boilerplate code, Director-reflector creates a robust, standardized, and re-usable Director client API wrapper base for any [Director](http://github.com/flatiron/director) router.

**Note**: Director-reflector makes the least amount of assumptions possible about your application. The API client wrapper it reflects, is designed to be **as minimalistic as possible**. The default client will cover all routes out of the box, but **you are encouraged to extend the reflected base client with your own personal sugar-syntax**. 


# Installation

     npm install director-reflector

# Usage

### Creating a Director router

```js

var director = require('director'),
    router   = new director.http.Router();

router.get('/foo', function(){
  this.res.end('hello');
});

```
### Creating a new API client from a Director router


```js

var dr = require('director-reflector'),

var client = dr.createClient(router);

client.foo(function(err, res, body){
  console.log(body);
})
```

### Making your Director router portable

In most cases, it's not secure to expose your entire Router instance to the client.

**Have no fear! Director routing maps can safety be serialized without exposing any protected logic.**

Run the following code and you'll have a portable ( and safe ) routing map as JSON:

```js
var router = {
  routes: JSON.stringify(server.router.routes)
};
```

Here is an example of [an exported routing map](https://github.com/flatiron/director-reflector/blob/master/examples/exported-router.json).


## Default Mappings

**If only one verb is bound to the route, the route name becomes the method name.**

```
router.get('/foo')                          =>  client.foo()
router.post('/bar')                         =>  client.bar()
```

**If multiple verbs are bound to the route, each verb becomes a method with a restful name.**

```
router.get('/moo')                          =>  client.moo.get()
router.post('/moo')                         =>  client.moo.create()
router.delete('/moo')                       =>  client.moo.destroy()
router.put('/moo')                          =>  client.moo.save()
```

**If route parameters are used ( such as an id ), they become the last method's first argument.**

```
router.post('/albums/:albumid')             =>  client.albums.create('ill-communication', { artist: "beastie boys" })
router.get('/albums/:albumid')              =>  client.albums.get('ill-communication')
```

**If multiple route parameters are used, the parameters curry as arguments in the last method from left-to-right.**

```
router.post('/albums/:albumid/songs/:id')   =>  client.albums.songs.create('ill-communication', 'root-down', data)
router.get('/albums/:albumid/songs/:id')    =>  client.albums.songs.get('ill-communication', 'root-down')
```

**Nested routing scopes follow the same rules.**

```
router.path('/users', function(){             
  this.path('/:id', function(){               
    this.post(n);                           => client.users.create('bob', data)
    this.get(n);                            => client.users.get('bob')
    this.delete(n);                         => client.users.destroy('bob')
    this.put(n);                            => client.users.save('bob', data)
    this.path('/dongles/:id', function(){
      this.post(n);                         => client.users.dongles.create('bob', 'the-dongle', data)
      this.get(n);                          => client.users.dongles('bob', 'the-dongle');
  })
});
```

# TODO

 - Add ability for built-in authorization strategies. 
 - Add `nconf` based config management
 - Add more tests

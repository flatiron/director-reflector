# Director-Client

Reflects a Node.js HTTP client API wrapper for pre-existing [Director](http://github.com/flatiron/director) routers. Compatible with any `Director.Router` instance. Requires **no** additional configuration.

# Explanation

Director-Client removes the process of writing boilerplate client code for communicating with [Director](http://github.com/flatiron/director) routers over HTTP. Director-Client uses <a href="http://en.wikipedia.org/wiki/Reflection_(computer_programming)">reflection</a> to reflect a node.js HTTP Client API wrapper API. This Client wrapper maps all remote routes to a local object and method calls.

Through the removal of this boilerplate code, Director-Client creates a robust, standardized, and re-usable http client API wrapper base for any [Director](http://github.com/flatiron/director) router.

Director-Client makes the least amount of assumptions possible about your application and creates an API wrapper whose complexity is **as minimalistic as possible**. 

**Note**: The default client which Director-Client reflects **will cover all routes out of the box, but you are encouraged to extend the reflected client with your own personal sugar-syntax**. 


# Installation

     npm install director-client

# Usage

```js

var director = require('director'),
    dc       = require('director-client'),
    router   = new director.http.Router();

router.get('/foo', function(){});

var client = dc.createClient(router);

client.foo(function(err, res, body){
  
})


```

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

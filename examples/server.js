var http = require('http'),
    director = require('director');

var router = exports.router = new director.http.Router();

//
// Simple respond method that echos back the request
//
var n = function(){
  var self = this,
  req = self.req,
  res = self.res;
  req.body = req.body || {};

  //
  // Create a response that echos back parsed HTTP information
  //
  var rsp = { 
    url: req.url, 
    data: req.body,
    method: req.method, 
    headers: req.headers
  };

  res.end(JSON.stringify(rsp));
};


// If only one verb is bound to the route, the route name becomes the method name.
router.get('/foo', n);
router.post('/bar', n);

router.get('/moo', n);                          // =>  client.moo.get()
router.post('/moo', n);                         // =>  client.moo.create()
router.delete('/moo', n);                      // =>  client.moo.destroy()
router.put('/moo', n);                          // =>  client.moo.save()

// If route parameters are used, they become the last methods argument signature.

router.post('/albums/:albumid', n);             // =>  client.albums.create('ill-communication', { artist: "beastie boys" })
router.get('/albums/:albumid', n);              // =>  client.albums.get('ill-communication')

// If multiple route parameters are used, then the ids curry as arguments from left-to-right.

router.post('/albums/:albumid/songs/:id', n);   // =>  client.albums.songs.create('ill-communication', 'root-down', data)
router.get('/albums/:albumid/songs/:id', n);    // =>  client.albums.songs.get('ill-communication', 'root-down')



router.path('/users', function(){

  /*
  this.post(n);
  this.get(n);   
  */
  this.path('/:id', function(){
    this.post(n);   
    this.get(n);    
    this.delete(n); 
    this.put(n);
    this.post('/eat', n);
    
    this.path('/dongles/:id', function(){
      this.get(n);
      this.post(n);
    })
  })
});

exports.start = function(port){
  var server;
  port = port || 8000;
  server = http.createServer(function(req, res){
    req.chunks = [];
    req.on('data', function (chunk) {
      req.chunks.push(chunk.toString());
    });
    router.dispatch(req, res, function(err){
      if(err) {
        res.end('404');
      }
    });
  }).listen(port);
  return server;
  console.log(' > http server started on port 8001')
}


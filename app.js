var express = require('express');

function apiapp (db){
  var app = express();

  var clips = db.collection('clips');

  app.use(express.bodyParser());
  app.post('/clip', function(req,res,next) {
    var password = req.body.password;
    var user = req.body.user;
    if(password != process.env.API_TEST_PASSWORD){
      res.set('Content-Type', 'text/plain').send(403,
        'If you want to insert a clip, you must speak the secret word');
    } else if(!user){
      res.set('Content-Type', 'text/plain').send(403,
        'Clips need to be attached to a given username' );
    } else {
      user = 'test~'+user;
      var html = req.body.html || '';
      var desc = req.body.desc || '';
      // NOTE: In a proper API, this should be set by the ID of the API
      // consumer corresponding to the key used to authenticate the method
      var source = req.body.source || 'anonymous';
      clips.insert({user: user, html: html.trim(),
        desc: desc.trim(), source: source}, {safe: true},
        function(err,doc) {
          if(err) return next(err);
          res.set('Content-Type', 'text/plain')
            .send(200,'Inserted:\n\n'+JSON.stringify(doc));
        });
    }
  });

  return app;
}


module.exports = function appctor(db){
var app = express();

app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

var clips = db.collection('clips');

app.use(express.static(__dirname+'/www'));

app.use('/api/v0',apiapp(db));
app.get('/api/v0/clip',function(req, res, next){
  res.render('manuclip.jade');
});

app.get('/:user',function(req, res, next){
  clips.find({user: req.params.user}, function(err,cursor) {
    if (err) return next(err);
    else cursor.toArray(function(err,userclips){
      if (err) return next(err);
      //TODO: Check for user entry, not user clips
      else if (userclips.length == 0) return next();
      else res.render('userclips.jade',{clips: userclips});
    });
  });
});
app.get('/:user/tags/:tag',function(req,res){});
app.get('/:user/:page',function(req,res){});


return app;
};


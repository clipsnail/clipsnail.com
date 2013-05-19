var express = require('express');

function apiapp (db){
  var app = express();
  
  var clips = db.collection('clips');
  
  app.post('/clip', function(req,res,next) {
    var password = req.body.password;
    if(password == process.env.API_TEST_PASSWORD){
      var user = req.body.user || 'test~proto';
      var html = req.body.html || '';
      var desc = req.body.desc || '';
      clips.insert({user: user, html: html, desc: desc}, {safe: true},
        function(err) {
          if(err) return next(err);
        });
    } else {
      res.send(403,'If you want to insert a clip, you must speak the secret word')
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

app.get('/:user',function(req, res, next){
  clips.find({user: req.params.user}, function(err,userclips) {
    if(err) return next(err);
    res.render('userclips.jade',{clips: userclips});
  })
});
app.get('/:user/tags/:tag',function(req,res){});
app.get('/:user/:page',function(req,res){});


return app;
};


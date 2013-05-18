var express = require('express');

var app = express();

app.get('/:user',function(req,res){});
app.get('/:user/tags/:tag',function(req,res){});
app.get('/:user/:page',function(req,res){});

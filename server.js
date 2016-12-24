var express = require('express');
var ejs = require('ejs');
var path = require('path');
var mongoose = require('mongoose');


var app = express()
app.set('view engine', 'ejs');
app.use('/views', express.static(path.join(__dirname, 'views')))

app.get('/', function (req, res) {
  res.render('index')
})

//get around favicon request
app.get('/favicon.ico', function(req, res) {
    res.send(200);
});

app.get('/api/:search', function(req, res){
      
})

app.listen(process.env.PORT || 80, function () {
  console.log('listening on port 8080!')
})
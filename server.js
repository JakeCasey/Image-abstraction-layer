var express = require('express');
var ejs = require('ejs');
var path = require('path');
var mongoose = require('mongoose');
var https = require('https');
var searches = require('./models/searchModel');

mongoose.connect('mongodb://localhost/');
mongoose.set('debug', true)



var app = express();
app.set('view engine', 'ejs');
app.use('/views', express.static(path.join(__dirname, 'views')));

app.get('/', function (req, res) {
  res.render('index')
});

//get around favicon request
app.get('/favicon.ico', function(req, res) {
    res.sendStatus(200);
});

app.get('/api/:search', function(req, res){
      //set options for http.get request
    var options = {
      hostname: 'api.imgur.com',
      path: '/3/gallery/search/viral/'+ req.query.offset +'/?q=' + req.params.search,
      method: 'GET',
      headers: {
        Authorization: 'Client-ID '
              }
      } 
      
      //save query to db, timestamp is created in searchModel.js using pre.('save', func());
      var searchq = req.params.search;
      var newSearch = searches({
            search: searchq
          })
          
          newSearch.save(function(err){
          if (err){return err}
              console.log('search query created');
            
          })
 
    https.get(options, function(req){
         
      var rawData = '';
      var responseData = [];
      req.setEncoding('utf8');
       
      req.on('data', function(chunk){
          rawData += chunk;
        });
        
      req.on('end', function(){
         //parse raw JSON data
          var data = JSON.parse(rawData);
          for (var key in data.data){
            //format parsed data
            var obj = {
              title: data.data[key].title,
              url: data.data[key].link,
              description: data.data[key].description
            };
            //push data to response array
            responseData.push(obj);
          }
              res.send(responseData);
        });
      });
      
          
    

     
     
    
      
});

app.get('/api/latest/imagesearch', function(req, res){
    // retrieve searches from database 
    searches.find({}, 'search created_at -_id', function(err, search){
      if(err){return err};
      
      res.send(search);
    }).limit(10);
});

app.listen(process.env.PORT || 80, function () {
  console.log('listening')
});
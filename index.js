var express = require('express');
var bodyParser = require('body-parser');
var app = express();

var data;


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(express.static('public'));
app.set('view engine', 'ejs');

//render index on home page
app.get('/', function(req,res){
   res.render('index', data);
  });

  //render index on home page
  app.get('/bar-chart', function(req,res){
     res.render('bar-chart', data);
  });

app.listen(3000, function(){
    console.log("App is listening on port 3000...");
});

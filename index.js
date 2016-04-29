// dependancies
var express = require('express');
var bodyParser = require('body-parser');
var app = express();

//help with this file from brittany mayes
var myPages = require('./controllers/exports');

//enables packages
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

//to set files ad folders at public level
app.use(express.static('public'));

//set view engine
app.set('view engine', 'ejs');

//routes
app.get('/', myPages.index );
app.get('/chart.html', myPages.chart );

//launch entire thing on 8080
app.listen(8080, function() {
    console.log("Listening on 8080");
});

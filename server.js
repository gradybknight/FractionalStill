// NPM packages:
var express = require("express");
var bodyParser = require("body-parser");
var path = require("path");


// port setup
var app = express();
var PORT = process.env.PORT || 3000;

// body parser setup 
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());




app.listen(PORT, function(){
    console.log("listening: " + PORT);
})
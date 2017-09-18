/********************************************************************************* * WEB322 – Assignment 02
* I declare that this assignment is my own work in accordance with Seneca Academic Policy. No part
* of this assignment has been copied manually or electronically from any other source
* (including 3rd party web sites) or distributed to other students. *
* Name: Emy Yeung         Student ID: 026 302 117           Date: Sept 18, 2017 *
* Online (Heroku) Link: https://fathomless-peak-93752.herokuapp.com/
* ********************************************************************************/

var express = require("express");
var app = express();
app.set('view engine', 'html');
app.use(express.static(__dirname + '/public'));

var HTTP_PORT = process.env.PORT || 8080;
function onHttpStart() {
    console.log("Express http server listen on: " + HTTP_PORT);
}

app.get("/", function(req,res){
    res.sendfile('views/home.html');
 });

app.get("/about", function(req, res) {
    res.sendfile('views/about.html');
});

app.listen(HTTP_PORT, onHttpStart);
// app.use(express.static('public'));
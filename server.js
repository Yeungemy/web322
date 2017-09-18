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
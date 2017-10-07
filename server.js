/********************************************************************************* * WEB322 – Assignment 02
* I declare that this assignment is my own work in accordance with Seneca Academic Policy. No part
* of this assignment has been copied manually or electronically from any other source
* (including 3rd party web sites) or distributed to other students. *
* Name: Emy Yeung         Student ID: 026 302 117           Date: Sept 18, 2017 *
* Online (Heroku) Link: https://fathomless-peak-93752.herokuapp.com/
* ********************************************************************************/
var data_service = require('./data-service.js');
var express = require("express");
var app = express();
var path = require("path");
app.set('view engine', 'html');
app.use(express.static(__dirname + '/public'));

var HTTP_PORT = process.env.PORT || 8080;
function onHttpStart() {
    console.log("Express http server listen on: " + HTTP_PORT);
    return new Promise((req, res) => {
        data_service.initialize().then((text)=> {
            console.log(text)
        }).catch((ex) => {
            console.log(ex);
        });
    });
}

app.get("/", function(req,res){
    res.sendFile(path.join(__dirname + "/views/home.html"));
 });

app.get("/about", function(req, res) {
    res.sendFile(path.join(__dirname + "/views/about.html"));
});

// Adding additional routes
app.get("/employees", (req, res) => {
    if(req.query.status){
        data_service.getEmployeesByStatus(req.query.status).then((data) => {
            res.json(data);
        }).catch((ex) => {
            res.json({Error: ex});
        });
    }
    else if(req.query.department){
        data_service.getEmployeesByDepartment(req.query.department).then((content) => {
            res.json(content);
        }).catch((ex) => {
            res.json({Error: ex});
        });
    }
    else if(req.query.manager){
        data_service.getEmployeesByManager(req.query.manager).then((content) => {
            res.json(content);
        }).catch((ex) => {
            res.json({Error: ex});
        });
    }
    else {
        data_service.getAllEmployees().then((content) => {
            res.json(content);
        }).catch((ex) => {
            res.json({Error: ex});
        });
    }
});

app.get("/employee/:num", (req, res) => {
    data_service.getEmployeeByNum(req.params.num).then((content) => {
        res.json(content);
    }).catch((ex) => {
        res.json({Error: ex});
    });   
});

app.get("/managers", (req, res) => {
    data_service.getManagers().then((content) => {
        res.json(content);
    }).catch((ex) => {
        res.json({Error: ex});
    });
});

app.get("/departments", (req, res) => {
    data_service.getDepartments().then((content) => {
        res.json(content);
    }).catch((ex) => {
        res.json({Error: ex});
    });
});


app.listen(HTTP_PORT, onHttpStart);
// app.use(express.static('public'));
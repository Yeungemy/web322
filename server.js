/********************************************************************************** 
 * WEB322 – Assignment 07
 * I declare that this assignment is my own work in accordance with Seneca Academic Policy. No part
 * of this assignment has been copied manually or electronically from any other source
 * (including 3rd party web sites) or distributed to other students. *
 * Name: Emy Yeung         Student ID: 026 302 117           Date: DEC 24, 2017 *
 * Online (Heroku) Link: https://fathomless-peak-93752.herokuapp.com/
 * ********************************************************************************/
const dataServiceAuth = require('./data-service-auth.js');
const clientSessions = require('client-sessions');
const dataServiceComments = require("./data-service-comments.js");
const data_service = require('./data-service.js');
const express = require("express");
const app = express();
const path = require("path");
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');

app.use(clientSessions({
    cookieName: "session", // this is the object name that will be added to 'req'
    secret: "web322_A7", // this should be a long un-guessable string.
    duration: 2 * 60 * 1000, // duration of the session in milliseconds (2 minutes)
    activeDuration: 1000 * 60 // the session will be extended by this many ms each request (1 minute)
}));

// // ensure that all of templates will have access to a "session" object
// app.use((req, res, next) => {
//     req.locals.session = req.session;
//     next();
// });

// checks if a user is logged in
function ensureLogin(req, res, next) {
    if (!req.session.user) {
        res.redirect("/login");
    } else {
        next();
    }
}

app.set('view engine', 'html');
app.use(express.static('public'));

app.use(bodyParser.urlencoded({
    extended: true
}));

app.engine(".hbs", exphbs({
    extname: ".hbs",
    defaultLayout: 'layout',
    helpers: {
        equal: function (lvalue, rvalue, options) {
            if (arguments.length < 3)
                throw new Error("Handlebars Helper equal needs 2 parameters");
            if (lvalue != rvalue)
                return options.inverse(this);
            else
                return options.fn(this);
        },

        times: function (n, block) {
            var accum = '',
                i = 0;
            while (++i <= n) {
                accum += block.fn(i);
            }
            return accum;
        }
    }
}));

app.set('view engine', '.hbs');

const HTTP_PORT = process.env.PORT || 8080;

data_service.initialize().then(dataServiceComments.initialize())
    .then(dataServiceAuth.initialize())
    .then(() => {
        app.listen(HTTP_PORT, onHttpStart);
    }).catch((err) => {
        console.log("unable to start the server: " + err);
    });

function onHttpStart() {
    console.log("Express http server listen on: " + HTTP_PORT);
}

// setup routes
app.get("/login", (req, res) => {
    res.render("login");
});

app.get("/register", (req, res) => {
    res.render("register");
});

app.get("/logout", (req, res) => {
    req.session.reset();
    res.redirect("/");
});

app.get("/", function (req, res) {
    res.render("home", {user: req.session.user});
});

app.get("/about", function (req, res) {
    dataServiceComments.getAllComments().then((data) => {
        res.render("about", {
            data: data, user: req.session.user
        });
    }).catch(() => {
        res.render("about");
    });
});

// Adding additional routes
app.get("/employees", ensureLogin, (req, res) => {
    if (req.query.status) {
        data_service.getEmployeesByStatus(req.query.status).then((data) => {
            res.render("employeeList", {
                data: data,
                title: "Employees",
                user: req.session.user
            });
        }).catch((ex) => {
            res.render("employeeList", {
                data: {},
                title: "Employees"
            });
        });
    } else if (req.query.department) {
        data_service.getEmployeesByDepartment(req.query.department).then((data) => {
            res.render("employeeList", {
                data: data,
                title: "Employees",
                user: req.session.user
            });
        }).catch((ex) => {
            res.render("employeeList", {
                data: {},
                title: "Employees"
            });
        });
    } else if (req.query.manager) {
        data_service.getEmployeesByManager(req.query.manager).then((data) => {
            res.render("employeeList", {
                data: data,
                title: "Employees",
                user: req.session.user
            });
        }).catch((ex) => {
            res.render("employeeList", {
                data: {},
                title: "Employees"
            });
        });
    } else {
        data_service.getAllEmployees().then((data) => {
            res.render("employeeList", {
                data: data,
                title: "Employees",
                user: req.session.user
            });
        }).catch((ex) => {
            res.render("employeeList", {
                data: {},
                title: "Employees"
            });
        });
    }
});

app.get("/employee/:empNum", ensureLogin, (req, res) => {
    // initialize an empty object to store the values 
    let viewData = {};
    data_service.getEmployeeByNum(req.params.empNum).then((data) => {
        viewData.data = data; //store employee data in the "viewData" object as "data" 
    }).catch(() => {
        viewData.data = null; // set employee to null if there was an error 
    }).then(data_service.getDepartments).then((data) => {
        viewData.departments = data; // store department data in the "viewData" object as "departments"
        // loop through viewData.departments and once we have found the departmentId that matches // the employee's "department" value, add a "selected" property to the matching
        // viewData.departments object
        for (let i = 0; i < viewData.departments.length; i++) {
            if (viewData.departments[i].departmentId == viewData.data.department) {
                viewData.departments[i].selected = true;
            }
        }
    }).catch(() => {
        viewData.departments = []; // set departments to empty if there was an error
    }).then(() => {
        if (viewData.data == null) { // if no employee - return an error
            res.status(404).send("Employee Not Found");
        } else {
            res.render("employee", {
                viewData: viewData,
                user: req.session.user
            }); // render the "employee" view 
        }
    });
});


app.get("/managers", ensureLogin, (req, res) => {
    data_service.getManagers().then((data) => {
        res.render("employeeList", {
            data: data,
            title: "Employees (Managers)",
            user: req.session.user
        });
    }).catch((ex) => {
        res.render("employeeList", {
            data: {},
            title: "Employees (Managers)"
        });
    });
});

app.get("/departments", ensureLogin, (req, res) => {
    data_service.getDepartments().then((data) => {
        res.render("departmentList", {
            data: data,
            title: "Departments",
            user: req.session.user
        });
    }).catch((ex) => {
        res.render("departmentList", {
            data: {},
            title: "Departments"
        });
    });
});

app.get("/employees/add", ensureLogin, (req, res) => {
    data_service.getDepartments().then((data) => {
        res.render("addEmployee", {
            departments: data,
            user: req.session.user
        });
    }).catch((ex) => {
        console.log(ex);
        res.render("addEmployee", {
            departments: []
        });
    });
});

app.get("/departments/add", ensureLogin, (req, res) => {
    res.render("addDepartment", {
        title: "Department",
        user: req.session.user
    });
});

app.get("/employee/delete/:empNum", ensureLogin, (req, res) => {
    data_service.deleteEmployeeByNum(req.params.empNum).then((data) => {
        res.redirect("/employees");
    }).catch((err) => {
        res.status(500).send("Unable to Remove Employee / Employee not found");
    });
});

app.get("/department/:departmentId", ensureLogin, (req, res) => {
    data_service.getDepartmentById(req.params.departmentId).then((data) => {
        res.render("department", {
            data: data,
            user: req.session.user
        });
    });
});

// post routes for add or update data
app.post("/register", (req, res) => {
    dataServiceAuth.registerUser(req.body).then(() => {
        res.render("register", {successMessage: "User created"});
    }).catch((ex) => {
        res.render("register", {errorMessage: errorMessage, user: req.body.user});
    });
});

app.post("/login", (req, res) => {
    dataServiceAuth.checkUser(req.body).then(() => {
        const username = req.body.user;
        req.session.user = {
            username: username
        };
        res.redirect("/employees");
    }).catch((err) => {
        res.render("login", {errorMessage: err, user: req.body.user});
    });
});

app.post("/employees/add", ensureLogin, (req, res) => {
    data_service.addEmployee(req.body).then((data) => {
        res.redirect("/employees");
    }).catch((ex) => {
        console.log(ex);
    });
});

app.post("/employee/update", ensureLogin, (req, res) => {
    data_service.updateEmployee(req.body).then((data) => {
        res.redirect("/employees");
    }).catch((ex) => {
        console.log(ex);
    });
});

app.post("/departments/add", ensureLogin, (req, res) => {
    data_service.addDepartment(req.body).then((data) => {
        res.redirect("/departments");
    }).catch((ex) => {
        console.log(ex);
    });
});

// define the "/department/update" route
app.post("/department/update", ensureLogin, (req, res) => {
    data_service.updateDepartment(req.body).then((data) => {
        res.redirect("/departments");
    }).catch((ex) => {
        console.log(ex);
    });
});

app.post("/about/addComment", (req, res) => {
    dataServiceComments.addComment(req.body).then((data) => {
        res.redirect("/about");
    }).catch((ex) => {
        console.log(ex);
        res.redirect("/about");
    });
});

app.post("/about/addReply", (req, res) => {
    dataServiceComments.addReply(req.body).then((data) => {
        res.redirect("/about");
    }).catch((ex) => {
        console.log(ex);
        res.redirect("/about");
    });
});

app.use((req, res) => {
    res.status(404).send("Page Not Found");
});
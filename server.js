/********************************************************************************* * WEB322 – Assignment 02
 * I declare that this assignment is my own work in accordance with Seneca Academic Policy. No part
 * of this assignment has been copied manually or electronically from any other source
 * (including 3rd party web sites) or distributed to other students. *
 * Name: Emy Yeung         Student ID: 026 302 117           Date: Oct 18, 2017 *
 * Online (Heroku) Link: https://fathomless-peak-93752.herokuapp.com/
 * ********************************************************************************/
const data_service = require('./data-service.js');
const express = require("express");
const app = express();
const path = require("path");
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
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

function onHttpStart() {
    console.log("Express http server listen on: " + HTTP_PORT);
    return new Promise((req, res) => {
        data_service.initialize().then((text) => {
            console.log(text)
        }).catch((ex) => {
            console.log(ex);
        });
    });
}

app.get("/", function (req, res) {
    res.render("home");
});

app.get("/about", function (req, res) {
    res.render("about");
});

// Adding additional routes
app.get("/employees", (req, res) => {
    if (req.query.status) {
        data_service.getEmployeesByStatus(req.query.status).then((data) => {
            res.render("employeeList", {
                data: data,
                title: "Employees"
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
                title: "Employees"
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
                title: "Employees"
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
                title: "Employees"
            });
        }).catch((ex) => {
            res.render("employeeList", {
                data: {},
                title: "Employees"
            });
        });
    }
});

app.get("/employee/:empNum", (req, res) => {
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
            res.render("employee", { viewData: viewData }); // render the "employee" view 
        }
    });
});


app.get("/managers", (req, res) => {
    data_service.getManagers().then((data) => {
        res.render("employeeList", {
            data: data,
            title: "Employees (Managers)"
        });
    }).catch((ex) => {
        res.render("employeeList", {
            data: {},
            title: "Employees (Managers)"
        });
    });
});

app.get("/departments", (req, res) => {
    data_service.getDepartments().then((data) => {
        res.render("departmentList", {
            data: data,
            title: "Departments"
        });
    }).catch((ex) => {
        res.render("departmentList", {
            data: {},
            title: "Departments"
        });
    });
});

app.get("/employees/add", (req, res) => {
    data_service.getDepartments().then((data) => {
        res.render("addEmployee", {
            departments: data
        });
    }).catch((ex) => {
        console.log(ex);
        res.render("addEmployee", {
            departments: []
        });
    });
});

app.get("/departments/add", (req, res) => {
    res.render("addDepartment", {title: "Department"});
});

app.get("/employee/delete/:empNum", (req, res) => {
    data_service.deleteEmployeeByNum(req.params.empNum).then((data) => {
        res.redirect("/employees");
    }).catch((err) => {
        res.status(500).send("Unable to Remove Employee / Employee not found");
    });
});

app.get("/department/:departmentId", (req, res) => {
    data_service.getDepartmentById(req.params.departmentId).then((data) => {
        res.render("department", {
            data: data
        });
    });
});

// add post route
app.post("/employees/add", (req, res) => {
    data_service.addEmployee(req.body).then((data) => {
        res.redirect("/employees");
    }).catch((ex) => {
        console.log(ex);
    })
})

app.post("/employee/update", (req, res) => {
    data_service.updateEmployee(req.body).then((data) => {
        res.redirect("/employees");
    }).catch((ex) => {
        console.log(ex);
    })
});

app.post("/departments/add", (req, res) => {
    data_service.addDepartment(req.body).then((data) => {
        res.redirect("/departments");
    }).catch((ex) => {
        console.log(ex);
    });
})

// define the "/department/update" route
app.post("/department/update", (req, res) => {
    data_service.updateDepartment(req.body).then((data) => {
        res.redirect("/departments");
    }).catch((ex) => {
        console.log(ex);
    });
})

app.use((req, res) => {
    res.status(404).send("Page Not Found");
});

app.listen(HTTP_PORT, onHttpStart);
// app.use(express.static('public'));
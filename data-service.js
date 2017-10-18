var fs = require('fs');
var employees = [];
var departments = [];
var empCount = 0;

module.exports.initialize = () => {
    return new Promise((resolve, reject) => {
        try {
            employees = JSON.parse(fs.readFileSync('./data/employees.json'));
            departments = JSON.parse(fs.readFileSync('./data/departments.json'));
            empCount = employees.length;
            resolve("Copied JSON file successfully");
        } catch (ex) {
            reject("Failed to copy JSON file");
        }
    });
}

module.exports.getAllEmployees = () => {
    var getAllEmp = [];
    return new Promise((resolve, reject) => {
        if (employees.length > 0) {
            for (let i = 0; i < employees.length; i++) {
                getAllEmp.push(employees[i]);
            }
            resolve(getAllEmp);
        } else {
            reject("No employee on the list");
        }
    });
}

module.exports.getEmployeesByStatus = (status) => {
    var getEmpByStatus = [];
    return new Promise((resolve, reject) => {
        for (let i = 0; i < employees.length; i++) {
            if (employees[i].status == status) {
                getEmpByStatus.push(employees[i]);
            }
        }
        getEmpByStatus.length == 0 ? reject("Not Found") : resolve(getEmpByStatus);
    });
}

module.exports.getEmployeesByDepartment = (department) => {
    var getEmpByDpt = [];
    return new Promise((resolve, reject) => {
        for (let i = 0; i < employees.length; i++) {
            if (employees[i].department == department) {
                getEmpByDpt.push(employees[i]);
            }
        }
        getEmpByDpt.length == 0 ? reject("Not Found") : resolve(getEmpByDpt);
    });
}

module.exports.getEmployeesByManager = (manager) => {
    var getEmpByMgr = [];
    return new Promise((resolve, reject) => {
        for (let i = 0; i < employees.length; i++) {
            if (employees[i].employeeManagerNum == manager) {
                getEmpByMgr.push(employees[i]);
            }
        }
        getEmpByMgr.length == 0 ? reject("Not Found") : resolve(getEmpByMgr);
    });
}

module.exports.getEmployeeByNum = (num) => {
    var getEmpByNo = [];
    return new Promise((resolve, reject) => {
        for (let i = 0; i < employees.length; i++) {
            if (employees[i].employeeNum == num) {
                getEmpByNo.push(employees[i]);
            }
        }
        getEmpByNo.length == 0 ? reject("Not Found") : resolve(getEmpByNo);
    });
}

module.exports.getManagers = () => {
    var getManagers = [];
    return new Promise((resolve, reject) => {
        for (let i = 0; i < employees.length; i++) {
            if (employees[i].isManager == true) {
                getManagers.push(employees[i]);
            }
        }
        getManagers.length == 0 ? reject("Not Found") : resolve(getManagers);
    });
}

module.exports.getDepartments = () => {
    var getDepartments = [];
    return new Promise((resolve, reject) => {
        if (departments.length > 0) {
            for (let i = 0; i < departments.length; i++) {
                getDepartments.push(departments[i]);
            }
            resolve(getDepartments);
        } else {
            reject("No department on the list");
        }
    });
}

module.exports.addEmployee = (employeeData) => {
    return new Promise((resolve, reject) => {
        try {
            employeeData.employeeNum = empCount + 1;
            employees[empCount] = employeeData;
            resolve();
        } catch (ex) {
            reject("Failed to add employee!");
        }
    });
}

module.exports.updateEmployee = (employeeData) => {   
    return new Promise((resolve, reject) => {
            try {
                var found = false;           
                for (var i = 0; i < employees.length && found == false; i++) {
                    if (employees[i].employeeNum == employeeData.employeeNum) {
                        found = true;
                        employees[i] = employeeData; 
                    }
                }
                resolve();                                         
        } catch (ex) {
            console.log(ex);
        }
    })
}
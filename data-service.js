const Sequelize = require('sequelize'); 
const sequelize = new Sequelize('d25t7mnvlgc9vj', 'oaxrlqorymetom', '7a28bf220c570783235deb37f117965722d98915f68140ba47cb69887a18697f', {
   host: 'ec2-54-83-25-217.compute-1.amazonaws.com',
   dialect: 'postgres',
   port: 5432,
   dialectOptions: {
       ssl: true
   }
});

sequelize.authenticate().then( () => {
    console.log('Connection has been established successfully!');
}).catch( (err) => {
    console.log("Unable to connect the database: " + err);
});

// Define a 'Employee' model
var Employee = sequelize.define('Employee', {
    employeeNum: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    firstName: Sequelize.STRING,
    last_name: Sequelize.STRING,
    email: Sequelize.STRING,
    SSN: Sequelize.STRING,
    addressStreet: Sequelize.STRING,
    addressCity: Sequelize.STRING,
    addressState: Sequelize.STRING,
    addressPostal: Sequelize.STRING,
    maritialStatus: Sequelize.STRING,
    isManager: Sequelize.BOOLEAN,
    employeeManagerNum: Sequelize.INTEGER,
    status: Sequelize.STRING,
    department: Sequelize.INTEGER,
    hireDate: Sequelize.STRING
    }, { // diable 'createdAt' and 'updatedAt'
        createdAt: false, 
        updatedAt: false
});

// define 'Department' Model
var Department = sequelize.define('Department', {
    departmentId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    departmentName: Sequelize.STRING
    }, { // diable 'createdAt' and 'updatedAt'
    createdAt: false, 
    updatedAt: false
});

module.exports.initialize = () => {
    return new Promise((resolve, reject) => {
        sequelize.sync().then( (Employee) => {
            resolve("Initialized employees Successfully!");
        }).then( (Department) => {
            resolve("Initialized department Successfully!");
        }).catch( (err) => {
            reject("Unable to sync the database");
        });
    });
}

module.exports.getAllEmployees = () => {
    return new Promise((resolve, reject) => {
        Employee.findAll().then((employee)=>{
            resolve(employee);
         }).catch((err)=>{
            reject("No results returned.")
         }); 
    });
}

module.exports.getEmployeesByStatus = (status) => {
    return new Promise((resolve, reject) => {
        Employee.findAll({
            where: {status: status}
        }).then((employee)=>{
            resolve(employee);
         }).catch((err)=>{
            reject("No results returned.")
         }); 
    });
}

module.exports.getEmployeesByDepartment = (department) => {
    return new Promise((resolve, reject) => {
        Employee.findAll({
            where: {department: department}
        }).then((employee)=>{
            resolve(employee);
         }).catch((err)=>{
            reject("No results returned.")
         }); 
    });
}

module.exports.getEmployeesByManager = (manager) => {
    return new Promise((resolve, reject) => {
        Employee.findAll({
            where: {employeeManagerNum: manager}
        }).then((employee)=>{
            resolve(employee);
         }).catch((err)=>{
            reject("No results returned.")
         }); 
    });
}

module.exports.getEmployeeByNum = (num) => {
    return new Promise((resolve, reject) => {
        Employee.findAll({
            where: {employeeNum: num}
        }).then((employee)=>{
            resolve(employee);
         }).catch((err)=>{
            reject("No results returned.")
         }); 
    });
}

module.exports.getManagers = () => {
    return new Promise((resolve, reject) => {
        Employee.findAll({
            where: {isManager: true}
        }).then((employee)=>{
            resolve(employee);
         }).catch((err)=>{
            reject("No results returned.")
         }); 
    });
}

module.exports.getDepartments = () => {
    return new Promise((resolve, reject) => {
        Department.findAll().then((department)=>{
            resolve(department);
         }).catch((err)=>{
            reject("No results returned.")
         }); 
    });
}

module.exports.addEmployee = (employeeData) => {
    employeeData.isManager = (employeeData.isManager)? true : false;
    return new Promise((resolve, reject) => {
        for(var i in employeeData) {
            if(employeeData[i] == "") {
                employeeData[i] = null;
            }
        }
        Employee.create({
            employeeNum: employeeData.employeeNum,
            firstName: employeeData.firstName,
            last_name: employeeData.last_name,
            email: employeeData.email,
            SSN: employeeData.SSN,
            addressStreet: employeeData.addressStreet,
            addresCity: employeeData.addresCity,
            isManager: employeeData.isManager,
            addressState: employeeData.addressState,
            addressPostal: employeeData.addressPostal,
            employeeManagerNum: employeeData.employeeManagerNum,
            status: employeeData.status,
            department: employeeData.department,
            hireDate: employeeData.hireDate
        }).then(()=>{
            resolve();
         }).catch(()=>{
            reject("Unable to update employee")
         })
    });
}

module.exports.updateEmployee = (employeeData) => {   
    employeeData.isManager = (employeeData.isManager)? true : false;
    return new Promise((resolve, reject) => { 
            for(var i in employeeData) {
                if(employeeData[i] == "") {
                    employeeData[i] = null;
                }
            }

            Employee.update({
                firstName: employeeData.firstName,
                last_name: employeeData.last_name,
                email: employeeData.email,
                addressStreet: employeeData.addressStreet,
                addresCity: employeeData.addresCity,
                addressPostal: employeeData.addressPostal,
                addressState: employeeData.addressPostal,
                isManager: employeeData.isManager,
                employeeManagerNum: employeeData.employeeManagerNum,
                status: employeeData.status,
                department: employeeData.department
            }, {
                where: {employeeNum: employeeData.employeeNum}
             }).then(()=>{
                resolve();
             }).catch(()=>{
                reject("Unable to add a new employee!!!")
             })
    });
}

module.exports.addDepartment = (departmentData) => {   
    return new Promise((resolve, reject) => {
        Department.create({
            departmentId: departmentData.departmentId,
            departmentName: departmentData.departmentName
        }).then(()=>{
            resolve();
         }).catch(()=>{
            reject("Unable to create a new department!!!")
         })
    });
}

module.exports.updateDepartment = (departmentData) => {
    return new Promise((resolve, reject) => {
            for (var key in departmentData) {
                if (departmentData.hasOwnProperty(key)) {
                    if(departmentData[key] == ""){
                        departmentData[key] = null
                    }
                }
            }

            Department.update({
                departmentName: departmentData.departmentName
            }, {
                where: { departmentId: departmentData.departmentId}
            }).then(()=>{
                resolve();
            }).catch(()=>{
                reject("unable to update department");
            });
    });
}

module.exports.getDepartmentById = (id) => {
    return new Promise((resolve, reject) => {
        Department.findAll({
            where: {departmentId: id}
        }).then((department) => {
            resolve(department);
        }).catch((err) => {
            reject("No results returned");
        });
    });
}

module.exports.deleteEmployeeByNum = (empNum) =>{
    return new Promise((resolve, reject) => {
        Employee.destroy({
            where:{employeeNum: empNum}
        }).then((employee) => {
                resolve(employee);
        }).catch((err) => {
                reject("Fail to remove that employeeNum")
        });
    });
}
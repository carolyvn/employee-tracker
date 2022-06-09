const inquirer = require('inquirer');
const mysql = require('mysql2');
const cTable = require('console.table');

// Connect to database
const db = mysql.createConnection(
    {
        host: 'localhost',
        port: 3306,
        // MySQL username
        user: 'root',
        // Your MySQL password
        password: 'YOUR PASSWORD', 
        database: 'employees_db'
    },
    console.log(`Connected to the employee_db database.`)
);

db.connect(function(err) {
    if (err) throw err;
    console.table('Welcome to Employee Management System');
    console.log("***********************************************************");
    console.log("*                                                         *");
    console.log("*                     EMPLOYEE MANAGER                    *");
    console.log("*                                                         *");
    console.log("***********************************************************");
    openDB();
})

function openDB() {

    inquirer
        .prompt([
            {
                type: 'list',
                message: 'What would you like to do?',
                name: 'choice',
                choices: [
                    'View All Departments',
                    'View All Employees',
                    'View All Roles',
                    'Add Department',
                    'Add Employee',
                    'Add Role',
                    'Update Employee Role',
                    'Delete an employee',
                    'Exit'
                ]
            }
        ])
        .then((answer) => {
            switch (answer.choice) {
                case 'View All Departments':
                    viewAllDepartments();
                    break;
                
                case 'View All Employees':
                    viewAllEmployees();
                    break;

                case 'View All Roles':
                    viewAllRoles();
                    break;

                case 'Add Department':
                    addDepartment();
                    break;

                case 'Add Employee':
                    addEmployee();
                    break;

                case 'Add Role':
                    addRole();
                    break;

                case 'Update Employee Role':
                    updateEmployeeRole();
                    break;
                
                case 'Delete an Employee':
                    deleteEmployee();
                    break;

                case 'Exit':
                    console.log("***********************************************************");
                    console.log("*                                                         *");
                    console.log("*       THANK YOU FOR USING THE EMPLOYEE MANAGER          *");
                    console.log("*                                                         *");
                    console.log("***********************************************************");
                    db.end();
                    break;   
            }
        });
}

// view all departments
function viewAllDepartments() {
    console.log(`\n All Departments: \n`);
    db.query('SELECT * FROM department', function (err, result) {
        console.table(result);
        openDB();
    });
}

// view all employees
function viewAllEmployees() {
    console.log(`\n All Employees: \n`);
    db.query(`
    SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager 
    FROM employee
    LEFT JOIN role ON employee.role_id = role.id
    LEFT JOIN department ON role.department_id = department.id
    LEFT JOIN employee AS manager ON manager.id = employee.manager_id`, function (err, result) {
        if (err) throw err;
        console.table(result);
        openDB();
    });
}

// view all roles 
function viewAllRoles() {
    console.log(`\n All Roles: \n`);
    db.query(`
    SELECT role.id, role.title, department.name AS department, role.salary 
    FROM role
    LEFT JOIN department ON role.department_id = department.id`, function (err, result) {
        console.table(result);
        openDB();
    });
}

// setup department array 
let deptArr = [];
function selectDepartment() {
    db.query('SELECT * FROM department', function (err, result) {
        if (err) throw err;
        for (let i = 0; i < result.length; i++) {
            deptArr.push(result[i].name);
        }
    })
    return deptArr;
};

// role array
let roleArr = [];
function selectRole() {
    db.query('SELECT * FROM role', function (err, result) {
        if (err) throw err;
        for (let i = 0; i < result.length; i++) {
            roleArr.push(result[i].title);
        }
    })
    return roleArr;
};

// manager array
let managerArr = []; 
function selectManager() {
    db.query('SELECT CONCAT(first_name, " ", last_name) AS manager FROM employee', function (err, result) {
        if (err) throw err;
        for (let i = 0; i < result.length; i++) {
            managerArr.push(result[i].first_name);
        }
    })
    return managerArr;
};

// employee array
let employeeArr = [];
function selectEmployee() {
    db.query(`SELECT employee.first_name, employee.last_name FROM employee`, function(err, result) {
        if (err) throw err;
        for (let i = 0; i < result.length; i++) {
            employeeArr.push(result[i].first_name, + ' ' + result[i].last_name);
        }
    })
    return employeeArr;
}

// add new department
function addDepartment() {
    inquirer
        .prompt([
            {
                type: 'input',
                message: 'What is the name of new Department?',
                name: 'newDepartment'
            }
        ])
        .then((answer) => {
            db.query('INSERT INTO department SET ?', {name: answer.newDepartment}, (err, result) =>{
                if (err) throw err;
                console.log(`Added ${answer.newDepartment} to the database`);
            });
            db.query('SELECT * FROM department', function (err, result) {
                console.log(`\n Current Departments: \n`);
                console.table(result);
                openDB();
            });
        });
}; 


// add new employee
function addEmployee() {
    inquirer
        .prompt([
            {
                type: 'input',
                message: 'What is new employee\'s first name?',
                name: 'firstName'
            },
            {
                type: 'input',
                message: 'What is new employee\'s last name?',
                name: 'lastName'
            },
            {
                type: 'list',
                message: 'What is the new employee\'s role?',
                name: 'role',
                choices: selectRole()
            },
            {
                type: 'list',
                message: 'Who is the new employee\'s manager?',
                name: 'manager',
                choices: selectManager()
            }
        ])
        .then((answer) => {
            console.log(answer);
            db.query(`
            INSERT INTO employee (first_name, last_name, role_id, manage_id) 
            VALUE("${answer.firstName}", "${answer.lastName}", (SELECT id FROM role WHERE title = "${answer.role}"), 
            (SELECT id FROM employee WHERE first_name = "${answer.manager}")`, (err, result) => {
                if (err) throw (err);
                console.log(`Added new employee to the database`);
            })
            db.query('SELECT * FROM employee', function(err, result) {
                console.table(result);
                openDB();
            })
        })
};

// add new role
function addRole() {
    inquirer
        .prompt([
            {
                type: 'input',
                message: 'What is the name for new role?',
                name: 'title'
            },
            {
                type: 'input',
                message: 'What is the salary for this role?',
                name: 'salary'
            },
            {
                type: 'list',
                message: 'Which department does the role belong to?',
                name: 'department',
                choices: selectDepartment()
            }
        ])
        .then((answer) => {
            db.query(`
            INSERT INTO role (title, salary, department_id)
            VALUES ("${answer.title}", "${answer.salary}", (SELECT id FROM department WHERE name = "${answer.department}"))`,
            (err, result) => {
                if (err) throw err;
                console.log(`Added new role to the database`);
            })
           
            db.query('SELECT * FROM role', function(err, result) {
                console.log(`\n Current Roles: \n`);
                console.table(result);
                openDB();
            })
        })
};

// update existing employee's role
function updateEmployeeRole() {
    inquirer
        .prompt([
            {
                type: 'list',
                message: 'Which employee\'s do you want to update?',
                name: 'updateEmployee',
                choices: selectEmployee()
            },
            {
                type: 'list',
                message: 'Which role do you want to assign the selected employee?',
                name: 'newRoleID',
                choices: selectRole()
            }
        ])
        .then((answer) => {
            db.query(`
            UPDATE employee SET role.title = ${answer.newRoleID}
            WHERE title = "${answer.updateEmployee}"`, (err, result) => {
                if (err) throw err;
                console.log(`Updated employee to new role`);
            })
            db.query('SELECT * FROM employee', function (err, result) {
                console.log('Employee after updated: \n');
                console.table(result);
                openDB();
            })
        });
};

// delete an employee
function deleteEmployee() {
    inquirer
        .prompt([
            {
                type: 'list',
                name: 'employee',
                message: 'Which employee would you like to delete?',
                choices: [...employeeArr]
            }
        ])
        .then((answer) => {
            db.query(`DELETE FROM employee WHERE CONCAT(first_name, ' ', last_name) = "${answer.employee}"`, (err, result) => {
                if (err) throw err;
                console.log('Employee deleted from database');
                openDB();
            })
        });
};
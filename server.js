const inquirer = require('inquirer');
const mysql = require('mysql2');
const consoleTable = require('console.table');
const { abort } = require('process');
const { identity } = require('rxjs');
const { opendir } = require('fs');

// Connect to database
const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: 'Cali2010',
        database: 'employees_db'
    },
    console.log(`Connected to the employee_db database.`)
);

db.connect(function(err) {
    if (err) throw err;
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

                case 'Exit':
                    db.end();
                    break;   
            }
        });
}

function viewAllDepartments() {
    db.query('SELECT * FROM department', function (err, result) {
        console.table(result);
        openDB();
    });
}

function viewAllEmployees() {
    db.query('SELECT * FROM employee', function (err, result) {
        console.table(result);
        openDB();
    });
}

function viewAllRoles() {
    db.query('SELECT * FROM role', function (err, result) {
        console.table(result);
        openDB();
    });
}

function addDepartment() {
    inquirer
        .prompt([
            {
                type: 'input',
                message: 'Enter the name of new Department',
                name: 'newDepartment'
            }
        ])
        .then((answer) => {
            // console.log(answer);
            db.query('INSERT INTO department SET ?', {name: answer.newDepartment}, (err, result) =>{
                if (err) throw err;
                // console.log(result);
            });
            db.query('SELECT * FROM department', function (err, result) {
                console.table(result);
                openDB();
            });
        });
};        

function addEmployee() {
    inquirer
        .prompt([
            {
                type: 'input',
                message: 'Enter new employee\'s first name',
                name: 'firstName'
            },
            {
                type: 'input',
                message: 'Enter new employee\'s last name',
                name: 'lastName'
            },
            // {
            //     type: 'input',
            //     message: 'Enter new employee\'s role ID',
            //     name: 'roleID'
            // },
            {
                type: 'input',
                message: 'Enter new employee\'s manager\'s ID',
                name: 'managerID',
            }
        ])
        .then((answer) => {
            console.log(answer);
            db.query('INSERT INTO employee SET ?', {first_name: answer.firstName, last_name: answer.lastName, manager_id: answer.managerID}, (err, result) => {
                if (err) throw err;
                console.log(result);
            })
            db.query('SELECT * FROM employee', function(err, result) {
                console.table(result);
                openDB();
            })
        })
};

function addRole() {
    inquirer
        .prompt([
            {
                type: 'input',
                message: 'Enter the name for new role',
                name: 'title'
            },
            {
                type: 'input',
                message: 'Enter the salary for this role',
                name: 'salary'
            },
            {
                type: 'input',
                message: 'Enter the department for this role',
                name: 'department',
            }
        ])
        .then((answer) => {
            db.query('INSERT INTO role SET ?', {title: answer.title, salary: answer.salary, department: answer.depar}, (err, result) => {
                if (err) throw err;
                console.log(result);
            })
            db.query('SELECT * FROM role', function(err, result) {
                console.table(result);
                openDB();
            })
        })
};

function updateEmployeeRole() {
    inquirer
        .prompt([
            {
                type: 'input',
                message: 'Enter the employee\'s ID you want to update',
                name: 'updateEmployee'
            },
            {
                type: 'input',
                message: 'Enter the employee\'s new role ID',
                name: 'newRoleID'
            }
        ])
        .then((answer) => {
            const newRoleID = answer.new
            db.query('UPDATE employee SET', function(err, result) {
                if (err) throw err;
                console.table(result);
                openDB();
            });
        });
}
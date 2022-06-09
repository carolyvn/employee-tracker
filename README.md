# Employee Tracker

## Description
A command-line application that manage a company's employee database, using Node.js, Inquirer, and MySQL.

## Installation
 - Clone the repo
 - Install following dependencies: `inquirer`, `mysql`, `console.table`
 - Run the application with `node server.js`

## Demo
![Untitled_ Jun 8, 2022 10_53 PM](https://user-images.githubusercontent.com/90424035/172775233-2e44ce44-790b-4df5-8545-f054e40dae33.gif)

## User Story
        AS A business owner
        I WANT to be able to view and manage the departments, roles, and employees in my company
        SO THAT I can organize and plan my business


## Acceptance Criteria
        GIVEN a command-line application that accepts user input
        WHEN I start the application
        THEN I am presented with the following options: view all departments, view all roles, view all employees, add a department, add a role, add an employee, and update an employee role
        WHEN I choose to view all departments
        THEN I am presented with a formatted table showing department names and department ids
        WHEN I choose to view all roles
        THEN I am presented with the job title, role id, the department that role belongs to, and the salary for that role
        WHEN I choose to view all employees
        THEN I am presented with a formatted table showing employee data, including employee ids, first names, last names, job titles, departments, salaries, and managers that the employees report to
        WHEN I choose to add a department
        THEN I am prompted to enter the name of the department and that department is added to the database
        WHEN I choose to add a role
        THEN I am prompted to enter the name, salary, and department for the role and that role is added to the database
        WHEN I choose to add an employee
        THEN I am prompted to enter the employee’s first name, last name, role, and manager, and that employee is added to the database
        WHEN I choose to update an employee role
        THEN I am prompted to select an employee to update and their new role and this information is updated in the database 
A command-line application that manages a company's employee database, using Node.js, Inquirer, and MySQL.

## Table of Contents
- [Installation](#installation)
- [Usage](#usage)
- [Credits](#credits)

## Installation
Clone the repository from Github to your local machine, install necessary dependencies with following command: ```npm install``` . Then run the command: ```node server.js``` to invoke the application.


## Usage
Allow user to view and manager the departments, roles, and employees in their company. 

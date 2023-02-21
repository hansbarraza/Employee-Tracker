const express = require('express');
const mysql = require('mysql2');
const inquirer = require('inquirer');
const cTable = require('console.table');
const { createConnection } = require('./db/employeeTracker');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({extended: false}));

const connection = createConnection();
connection.connect(err => {
if (err) throw err;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})
});

const startPrompt = () => {
    inquirer.prompt({
        type: 'list',
        name: 'menu',
        message: 'What would you like to do?',
        choices: ['View All Departments', 'View All Roles', 'View All Employees', 'Add a Department', 'Add a Role', 'Add an Employee','Update an Employee Role',],
    }).then(answer => {
        switch (answer.menu) {
            case 'View All Departments':
                viewAllDepartments();
                break;
            case 'View All Roles':
                viewAllRoles();
                break;
            case 'View All Employees':
                viewAllEmployees();
                break;
            case 'Add a Department':
                addADepartment();
                break;
            case 'Add a Role':
                addARole();
                break;
            case 'Add an Employee':
                addAnEmployee();
                break;
            case 'Update an Employee Role':
                updateAnEmployeeRole();
                break;

        }
    })
};

const viewAllDepartments = () => {
    const sql = `SELECT * FROM department`;
    connection.query(sql,(err, result) => {
        if (err) {
            result.serverStatus(400).json({error: err.message})
            return;
        }
        console.table(result);
        startPrompt();
    })
};






startPrompt();




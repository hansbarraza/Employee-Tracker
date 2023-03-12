// Importing required modules
const express = require('express');
const mysql = require('mysql2');
const inquirer = require('inquirer');
const cTable = require('console.table');
const { createConnection } = require('./db/employeeTracker');

// Creating Express application and configuring it to use JSON and urlencoded formats
const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({extended: false}));

// Creating a connection to the database and starting the server
const connection = createConnection();
connection.connect(err => {
if (err) throw err;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})
});

// Prompt to display when the application starts
const startPrompt = () => {
    inquirer.prompt({
        type: 'list',
        name: 'menu',
        message: 'What would you like to do?',
        choices: ['View All Departments', 'View All Roles', 'View All Employees', 'Add a Department', 'Add a Role', 'Add an Employee','Update an Employee Role', 'Update an Employee Manager', 'Delete a Role', 'Delete an Employee', 'Delete a Department'],
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
            case 'Update an Employee Manager':
                updateAnEmployeeManager();
                break;
            case 'Delete a Role':
                deleteARole();
                break;
            case 'Delete an Employee':
                deleteAnEmployee();
                break;
            case 'Delete a Department':
                deleteADepartment();
                break;

        }
    })
};

// Function to view all departments
const viewAllDepartments = () => {
    const sql = `SELECT * FROM department`;
    connection.query(sql, (err, result) => {
        if (err) throw err;
        console.table(result);
        startPrompt();
    })
};

// Function to view all roles
const viewAllRoles = () => {
    const sql = `SELECT * FROM role`;
    connection.query(sql, (err, result) => {
        if (err) throw err;
        console.table(result);
        startPrompt();
    })
};

// Function to view all employees
const viewAllEmployees = () => {
    const sql = `SELECT employee.id,
                employee.first_name,
                employee.last_name,
                role.title AS job_title,
                department.department_name,
                role.salary,
                CONCAT(manager.first_name, '' , manager.last_name) AS manager
                FROM employee
                LEFT JOIN role ON employee.role_id = role.id
                LEFT JOIN department ON role.department_id = department.id
                LEFT JOIN employee AS manager ON employee.manager_id = manager.id
                ORDER by employee.id`;
    connection.query(sql, (err, result) => {
        if (err) throw err;
        console.table(result);
        startPrompt();
    })
};

// Function to add a department
const addADepartment = () => {
    inquirer.prompt([
        {
            name: 'department_name',
            type: 'input',
            message: 'Enter the name of the department you would like to add to the database.'
        }
    ]).then ((answer) => {
        const sql = `INSERT INTO department (department_name)
                    VALUES (?)`;
        const params = [answer.department_name];
        connection.query(sql, params, (err, result) => {
            console.log('The new department has been added successfully to the database.');

        connection.query(`SELECT * FROM department`, (err, result) => {
                if (err) throw err;
                console.table(result);
                startPrompt();
        })
        })
    })
};

// Function to add a role
const addARole = () => {
    connection.query('SELECT * FROM department', (err, departments) => {
        if (err) throw err;

        const departmentChoices = departments.map((department) => ({
            name: department.department_name,
            value: department.id
        }));

        inquirer.prompt([
            {
                name: 'title',
                type: 'input',
                message: 'Enter the title of role you want to add to the database.'
            },
            {
                name: 'salary',
                type: 'input',
                message: 'Enter the salary associated with the role you want to add to the database.'
            },
            {
                name: 'department_id',
                type: 'list',
                message: 'Select the department associated with the role you want to add to the database.',
                choices: departmentChoices
            },
        ])
        .then((response) => {
            connection.query('INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)', 
            [response.title, response.salary, response.department_id], 
            (err, data) => {
                if (err) throw err;
                console.log('New role entered has been added successfully to the database.');

            connection.query(`SELECT * FROM role`, (err, result) => {
                    if (err) throw err;
                    console.table(result);
                    startPrompt();
              });
            }
            )
        })
    });
};

// Function to add an employee
const addAnEmployee = () => {
    connection.query('SELECT id, title FROM role', (err, roles) => {
      if (err) throw err;
      connection.query('SELECT id, CONCAT(first_name, " ", last_name) AS manager_name FROM employee', (err, managers) => {
        if (err) throw err;
        inquirer.prompt([
          {
            name: 'first_name',
            type: 'input',
            message: 'Enter the first name of the employee you want to add to the database.'
          },
          {
            name: 'last_name',
            type: 'input',
            message: 'Enter the last name of the employee you want to add to the database.'
          },
          {
            name: 'role_id',
            type: 'list',
            message: 'Select the role associated with the employee you want to add to the database.',
            choices: roles.map(role => ({ name: role.title, value: role.id }))
          },
          {
            name: 'manager_id',
            type: 'list',
            message: 'Select the added employee\'s manager.',
            choices: managers.map(manager => ({ name: manager.manager_name, value: manager.id }))
          },
        ])
    
        .then((response) => {
          connection.query('INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)', 
          [response.first_name, response.last_name, response.role_id, response.manager_id],
          (err, data) => {
            if (err) throw err;
            console.log('New employee has been added to the database.');
            connection.query(`SELECT * FROM employee`, (err, result) => {
              if (err) throw err;
              console.table(result);
              startPrompt();
            })
          })
        });
      })
    });
  };
  
// Function to update an employee's role
const updateAnEmployeeRole = () => {
    connection.query('SELECT * FROM role', (err, roles) => {
      if (err) throw err;
  
      connection.query('SELECT CONCAT(first_name, " ", last_name) AS full_name FROM employee', (err, employees) => {
        if (err) throw err;
  
        inquirer.prompt([
          {
            name: 'employee',
            type: 'list',
            message: 'Select the employee whose role you want to update.',
            choices: employees.map(employee => ({ name: employee.full_name, value: employee.full_name }))
          },
          {
            name: 'role',
            type: 'list',
            message: 'Select the new role for the employee.',
            choices: roles.map(role => ({ name: role.title, value: role.id }))
          }
        ])
        .then((response) => {
          connection.query('UPDATE employee SET role_id = ? WHERE CONCAT(first_name, " ", last_name) = ?', [response.role, response.employee], (err, data) => {
            if (err) throw err;
            console.log('Employee role updated successfully.');
  
            connection.query(`SELECT * FROM employee`, (err, result) => {
              if (err) throw err;
              console.table(result);
              startPrompt();
            })
          })
        });
      });
    });
  };
  

// Function to delete a department
const deleteADepartment = () => {
    // Get department IDs from database
    connection.query("SELECT id, department_name FROM department", (err, data) => {
        if (err) throw err;
        const departments = data.map(department => ({ name: department.department_name, value: department.id }));

        inquirer.prompt([
            {
                name: "department_id",
                type: "list",
                message: "Please select the department you want to delete from the list below:",
                choices: departments
            }
        ]).then((response) => {
            connection.query("DELETE FROM department WHERE id = ?", [response.department_id], (err, data) => {
                if (err) throw err;
                console.log("The department entered has been deleted successfully from the database.");

                connection.query(`SELECT * FROM employee`, (err, result) => {
                    if (err) throw err;
                    console.table(result);
                    startPrompt();
                });
            });
        });
    });
};
// Function to delete a role
const deleteARole = () => {
    connection.query("SELECT id, title FROM role", (err, data) => {
        if (err) throw err;
        const roles = data.map(role => ({ name: role.title, value: role.id }));

        inquirer.prompt([
        {
            name: "role_id",
            type: "list",
            message: "Please select the role you want to delete from the database.",
            choices: roles
        }
        ]).then ((response) => {
            connection.query("DELETE FROM role WHERE id = ?", [response.role_id], (err, data) => {
                if (err) throw err;
            console.log("The role entered has been deleted from database.");

            connection.query(`SELECT * FROM role`, (err, result) => {
                if (err) throw err;
                console.log (result);
                startPrompt();
                });
            });
        });
    });
};

// Function to delete an employee
const deleteAnEmployee = () => {
    // Get employee IDs and names from database
    db.query("SELECT id, CONCAT(first_name, ' ', last_name) AS name FROM employee", (err, data) => {
        if (err) throw err;
        const employees = data.map(employee => ({ name: employee.name, value: employee.id }));

        inquirer.prompt([
            {
                name: "employee_id",
                type: "list",
                message: "Please select the employee you want to delete from the list below:",
                choices: employees
            }
        ]).then((response) => {
            connection.query("DELETE FROM employee WHERE id = ?", [response.employee_id], (err, data) => {
                if (err) throw err;
                console.log("The employee entered has been deleted from the database.");

                connection.query(`SELECT * FROM employee`, (err, result) => {
                    if (err) throw err;
                        console.table(result);
                        startPrompt();
                    });
                });
            });
        });
};

startPrompt();




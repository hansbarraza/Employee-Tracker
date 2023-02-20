const getAllEmployeeQuery = `
SELECT employee.id, first_name, last_name, title, salary, department_name
FROM employee
INNER JOIN role
ON employee.role_id = role.id
INNER JOIN department 
ON role.department_id = department_id`;

module.exports = {
    getAllEmployeeQuery,
};
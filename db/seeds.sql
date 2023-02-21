INSERT INTO department (department_name)
VALUES
  ('HR'),
  ('Tech'),
  ('Marketing'),
  ('Finance'),
  ('Sales'),
  ('Engineering'),
  ('Legal');

INSERT INTO role (title, salary, department_id)
VALUES
  ('Recruiter ', 40000, 1),
  ('Marketer', 50000, 3),
  ('Software Engineer', 100000, 2),
  ('Attorney', 200000, 7),
  ('Salesperson', 110000, 5),
  ('Engineer', 90000, 6),
  ('Accountant', 140000, 7),
  ('Sales Lead', 160000, 5),
  ('CEO', 400000, 5);

INSERT INTO employee (first_name, last_name, role_id, manager_id) 
VALUES 
('Emma', 'Thompson', 1, 1),
('Anthony', 'Hopkins', 2, 2),
('Keira', 'Knightley', 3, 1),
('Tom', 'Hanks', 4, 3),
('Jennifer', 'Lawrence', 5, 1),
('Daniel', 'Radcliffe', 6, 3);
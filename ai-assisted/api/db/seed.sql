-- AI Prompt: "Generate seed SQL data for users, equipment, and requests in a school lending system, 
-- with hashed passwords as placeholders and fixed availability matching quantity."
-- AI Refactor: "Fixed manual mismatches in quantity/available; AI suggested hashed placeholders."

DELETE FROM requests;
DELETE FROM equipment;
DELETE FROM users;

INSERT INTO users (name, email, password, role) VALUES
('Admin User', 'admin@example.com', '$2b$10$examplehashforadmin123', 'admin'),  -- Replace with actual bcrypt hash of 'admin123'
('Staff Member', 'staff@example.com', '$2b$10$examplehashforstaff123', 'staff'),  -- Replace with actual bcrypt hash of 'staff123'
('Student A', 'studenta@example.com', '$2b$10$examplehashforstudent123', 'student'),  -- Replace with actual bcrypt hash of 'student123'
('Student B', 'studentb@example.com', '$2b$10$examplehashforstudent123', 'student');  -- Replace with actual bcrypt hash of 'student123'

INSERT INTO equipment (name, category, condition, quantity, available) VALUES
('Microscope', 'Lab', 'Good', 5, 5),
('Basketball', 'Sports', 'Good', 10, 10),
('Camera', 'Media', 'Fair', 3, 3),
('Guitar', 'Music', 'New', 2, 2),
('Laptop', 'Electronics', 'Good', 6, 6);

INSERT INTO requests (user_id, equipment_id, status, from_date, to_date) VALUES
(3, 1, 'pending', '2025-10-28', '2025-10-30'),
(3, 2, 'approved', '2025-10-20', '2025-10-22'),
(4, 3, 'returned', '2025-10-10', '2025-10-12'),
(4, 4, 'rejected', '2025-10-15', '2025-10-18');
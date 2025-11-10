DELETE FROM requests;
DELETE FROM equipment;
DELETE FROM users;

INSERT INTO users (name, email, password, role) VALUES
('Admin User', 'admin@example.com', 'admin123', 'admin'),
('Staff Member', 'staff@example.com', 'staff123', 'staff'),
('Student A', 'studenta@example.com', 'student123', 'student'),
('Student B', 'studentb@example.com', 'student123', 'student');

INSERT INTO equipment (name, category, condition, quantity, available) VALUES
('Microscope', 'Lab', 'Good', 5, 1),
('Basketball', 'Sports', 'Good', 10, 1),
('Camera', 'Media', 'Fair', 3, 1),
('Guitar', 'Music', 'New', 2, 1),
('Laptop', 'Electronics', 'Good', 6, 1);

INSERT INTO requests (user_id, equipment_id, status, from_date, to_date) VALUES
(3, 1, 'pending', '2025-10-28', '2025-10-30'),
(3, 2, 'approved', '2025-10-20', '2025-10-22'),
(4, 3, 'returned', '2025-10-10', '2025-10-12'),
(4, 4, 'rejected', '2025-10-15', '2025-10-18');

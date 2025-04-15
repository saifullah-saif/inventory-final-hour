-- Users table
CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    role ENUM('Admin', 'Manager') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Categories table
CREATE TABLE categories (
    category_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Suppliers table
CREATE TABLE suppliers (
    supplier_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    contact_person VARCHAR(100),
    email VARCHAR(100),
    phone VARCHAR(20),
    address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Products table
CREATE TABLE products (
    product_id INT AUTO_INCREMENT PRIMARY KEY,
    sku VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    category_id INT,
    price DECIMAL(10, 2) NOT NULL,
    current_stock INT NOT NULL DEFAULT 0,
    low_stock_threshold INT DEFAULT 10,
    supplier_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(category_id),
    FOREIGN KEY (supplier_id) REFERENCES suppliers(supplier_id)
);

-- Product Images table
CREATE TABLE product_images (
    image_id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL,
    image_url VARCHAR(255) NOT NULL,
    is_primary BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE CASCADE
);

-- Inventory Batches table

-- Purchase Orders table
CREATE TABLE purchase_orders (
    po_id INT AUTO_INCREMENT PRIMARY KEY,
    supplier_id INT NOT NULL,
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status ENUM('Draft', 'Pending', 'Approved', 'Received', 'Canceled') DEFAULT 'Draft',
    total_amount DECIMAL(12, 2) NOT NULL,
    notes TEXT,
    created_by INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (supplier_id) REFERENCES suppliers(supplier_id),
    FOREIGN KEY (created_by) REFERENCES users(user_id)
);

-- Purchase Order Items table
CREATE TABLE purchase_order_items (
    po_item_id INT AUTO_INCREMENT PRIMARY KEY,
    po_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    unit_price DECIMAL(10, 2) NOT NULL,
    total_price DECIMAL(10, 2) NOT NULL,
    received_quantity INT DEFAULT 0,
    FOREIGN KEY (po_id) REFERENCES purchase_orders(po_id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(product_id)
);

-- Customers table
CREATE TABLE customers (
    customer_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE,
    phone VARCHAR(20),
    address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Orders table
CREATE TABLE orders (
    order_id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT NOT NULL,
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status ENUM('Pending', 'Processing', 'Shipped', 'Delivered', 'Canceled') DEFAULT 'Pending',
    shipping_address TEXT NOT NULL,
    shipping_method VARCHAR(50),
    total_amount DECIMAL(12, 2) NOT NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id)
);

-- Order Items table
CREATE TABLE order_items (
    order_item_id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    batch_id INT,
    quantity INT NOT NULL,
    unit_price DECIMAL(10, 2) NOT NULL,
    total_price DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(product_id)
    
);

-- Payment Transactions table
CREATE TABLE payment_transactions (
    transaction_id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    payment_method ENUM('Stripe', 'SSL', 'Bkash') NOT NULL,
    amount DECIMAL(12, 2) NOT NULL,
    status ENUM('Pending', 'Completed', 'Failed', 'Refunded') DEFAULT 'Pending',
    transaction_reference VARCHAR(100),
    payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    notes TEXT,
    FOREIGN KEY (order_id) REFERENCES orders(order_id)
);

-- Refunds table
CREATE TABLE refunds (
    refund_id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    transaction_id INT NOT NULL,
    amount DECIMAL(12, 2) NOT NULL,
    reason TEXT,
    status ENUM('Pending', 'Processed', 'Rejected') DEFAULT 'Pending',
    processed_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(order_id),
    FOREIGN KEY (transaction_id) REFERENCES payment_transactions(transaction_id),
    FOREIGN KEY (processed_by) REFERENCES users(user_id)
);

-- Stock Movement Log table
CREATE TABLE stock_movements (
    movement_id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL,
    batch_id INT,
    quantity INT NOT NULL,
    movement_type ENUM('Purchase', 'Sale', 'Adjustment', 'Return') NOT NULL,
    reference_id INT,
    reference_type ENUM('PurchaseOrder', 'Order', 'Manual') NOT NULL,
    notes TEXT,
    created_by INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(product_id),
    
    FOREIGN KEY (created_by) REFERENCES users(user_id)
);

-- Supplier Payments table
CREATE TABLE supplier_payments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    supplier_id INT NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    status ENUM('pending', 'completed', 'failed') NOT NULL,
    payment_intent_id VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (supplier_id) REFERENCES suppliers(supplier_id)
);

-- Insert demo Users
INSERT INTO users (username, password, email, role) VALUES
('admin', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin@example.com', 'Admin'),
('manager', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'manager@example.com', 'Manager');

-- Insert demo Categories
INSERT INTO categories (name, description) VALUES
('Electronics', 'Electronic devices and accessories'),
('Clothing', 'Apparel and fashion items'),
('Home & Kitchen', 'Household and kitchen products'),
('Books', 'Books, e-books, and publications'),
('Sports & Outdoors', 'Sports equipment and outdoor gear');

-- Insert demo Suppliers
INSERT INTO suppliers (name, contact_person, email, phone, address) VALUES
('Tech Suppliers Inc.', 'John Smith', 'john@techsuppliers.com', '555-1234', '123 Tech Street, Silicon Valley, CA'),
('Fashion Wholesale Ltd.', 'Emma Johnson', 'emma@fashionwholesale.com', '555-2345', '456 Fashion Avenue, New York, NY'),
('Home Essentials Co.', 'Michael Brown', 'michael@homeessentials.com', '555-3456', '789 Home Road, Chicago, IL'),
('Book Distributors', 'Sarah Williams', 'sarah@bookdist.com', '555-4567', '101 Book Lane, Boston, MA'),
('Sports Gear Direct', 'David Miller', 'david@sportsgear.com', '555-5678', '202 Sports Blvd, Denver, CO');

-- Insert demo Products
INSERT INTO products (sku, name, description, category_id, price, current_stock, low_stock_threshold, supplier_id) VALUES
('ELEC-001', 'Smartphone X', 'Latest smartphone with advanced features', 1, 899.99, 50, 10, 1),
('ELEC-002', 'Laptop Pro', 'High-performance laptop for professionals', 1, 1299.99, 30, 5, 1),
('ELEC-003', 'Wireless Earbuds', 'Premium wireless earbuds with noise cancellation', 1, 149.99, 100, 20, 1),
('CLOTH-001', 'Men\'s T-Shirt', 'Comfortable cotton t-shirt for men', 2, 24.99, 200, 30, 2),
('CLOTH-002', 'Women\'s Jeans', 'Stylish denim jeans for women', 2, 49.99, 150, 25, 2),
('CLOTH-003', 'Kids\' Sweater', 'Warm winter sweater for children', 2, 34.99, 100, 20, 2),
('HOME-001', 'Coffee Maker', 'Automatic drip coffee maker', 3, 79.99, 40, 8, 3),
('HOME-002', 'Blender', 'High-speed blender for smoothies and more', 3, 59.99, 35, 7, 3),
('HOME-003', 'Toaster', '2-slice toaster with multiple settings', 3, 29.99, 50, 10, 3),
('BOOK-001', 'The Great Novel', 'Bestselling fiction novel', 4, 14.99, 75, 15, 4),
('BOOK-002', 'Cooking Guide', 'Comprehensive cookbook for beginners', 4, 19.99, 60, 12, 4),
('BOOK-003', 'Business Strategy', 'Book on modern business strategies', 4, 24.99, 40, 8, 4),
('SPORT-001', 'Yoga Mat', 'Non-slip exercise yoga mat', 5, 29.99, 80, 16, 5),
('SPORT-002', 'Dumbbells Set', '5-25 lbs adjustable dumbbells set', 5, 199.99, 25, 5, 5),
('SPORT-003', 'Running Shoes', 'Lightweight running shoes', 5, 89.99, 60, 12, 5);

-- Insert demo Product Images
INSERT INTO product_images (product_id, image_url, is_primary) VALUES
(1, 'https://example.com/images/smartphone-x-1.jpg', TRUE),
(1, 'https://example.com/images/smartphone-x-2.jpg', FALSE),
(2, 'https://example.com/images/laptop-pro-1.jpg', TRUE),
(3, 'https://example.com/images/wireless-earbuds-1.jpg', TRUE),
(4, 'https://example.com/images/mens-tshirt-1.jpg', TRUE),
(5, 'https://example.com/images/womens-jeans-1.jpg', TRUE),
(6, 'https://example.com/images/kids-sweater-1.jpg', TRUE),
(7, 'https://example.com/images/coffee-maker-1.jpg', TRUE),
(8, 'https://example.com/images/blender-1.jpg', TRUE),
(9, 'https://example.com/images/toaster-1.jpg', TRUE),
(10, 'https://example.com/images/great-novel-1.jpg', TRUE),
(11, 'https://example.com/images/cooking-guide-1.jpg', TRUE),
(12, 'https://example.com/images/business-strategy-1.jpg', TRUE),
(13, 'https://example.com/images/yoga-mat-1.jpg', TRUE),
(14, 'https://example.com/images/dumbbells-set-1.jpg', TRUE),
(15, 'https://example.com/images/running-shoes-1.jpg', TRUE);


-- Insert demo Purchase Orders
INSERT INTO purchase_orders (supplier_id, order_date, status, total_amount, notes, created_by) VALUES
(1, '2024-01-05', 'Received', 32500.00, 'Initial stock order for Q1', 1),
(1, '2024-02-15', 'Received', 15000.00, 'Restocking popular electronics', 1),
(2, '2024-01-10', 'Received', 5000.00, 'Winter clothing collection', 1),
(2, '2024-03-01', 'Approved', 4000.00, 'Spring collection pre-order', 1),
(3, '2024-01-20', 'Received', 3000.00, 'Kitchen appliances restock', 2),
(4, '2024-02-10', 'Received', 2000.00, 'New book titles', 2),
(5, '2024-03-05', 'Approved', 5000.00, 'Spring sports equipment', 1);

-- Insert demo Purchase Order Items
INSERT INTO purchase_order_items (po_id, product_id, quantity, unit_price, total_price, received_quantity) VALUES
(1, 1, 30, 650.00, 19500.00, 30),
(1, 2, 15, 900.00, 13500.00, 15),
(2, 1, 20, 650.00, 13000.00, 20),
(2, 3, 20, 100.00, 2000.00, 20),
(3, 4, 100, 15.00, 1500.00, 100),
(3, 5, 75, 30.00, 2250.00, 75),
(3, 6, 50, 20.00, 1000.00, 50),
(4, 4, 100, 15.00, 1500.00, 0),
(4, 5, 75, 30.00, 2250.00, 0),
(4, 6, 50, 20.00, 1000.00, 0),
(5, 7, 20, 50.00, 1000.00, 20),
(5, 8, 35, 40.00, 1400.00, 35),
(5, 9, 50, 20.00, 1000.00, 50),
(6, 10, 75, 8.00, 600.00, 75),
(6, 11, 60, 12.00, 720.00, 60),
(6, 12, 40, 15.00, 600.00, 40),
(7, 13, 80, 18.00, 1440.00, 0),
(7, 14, 25, 140.00, 3500.00, 0),
(7, 15, 60, 60.00, 3600.00, 0);

-- Insert demo Customers
INSERT INTO customers (name, email, phone, address) VALUES
('Alice Johnson', 'alice@example.com', '555-1111', '123 Main St, Anytown, USA'),
('Bob Anderson', 'bob@example.com', '555-2222', '456 Elm St, Somewhere, USA'),
('Carol Martinez', 'carol@example.com', '555-3333', '789 Oak St, Anywhere, USA'),
('David Wilson', 'david@example.com', '555-4444', '101 Pine St, Nowhere, USA'),
('Emily Davis', 'emily@example.com', '555-5555', '202 Maple St, Everywhere, USA');

-- Insert demo Orders
INSERT INTO orders (customer_id, order_date, status, shipping_address, shipping_method, total_amount, notes) VALUES
(1, '2024-03-01 10:15:00', 'Delivered', '123 Main St, Anytown, USA', 'Standard', 949.98, 'Gift wrapped'),
(2, '2024-03-05 14:30:00', 'Shipped', '456 Elm St, Somewhere, USA', 'Express', 1374.98, NULL),
(3, '2024-03-10 09:45:00', 'Processing', '789 Oak St, Anywhere, USA', 'Standard', 159.97, 'Call before delivery'),
(4, '2024-03-15 16:20:00', 'Pending', '101 Pine St, Nowhere, USA', 'Standard', 89.98, NULL),
(5, '2024-03-20 11:05:00', 'Canceled', '202 Maple St, Everywhere, USA', 'Express', 229.98, 'Wrong address provided');

-- Insert demo Order Items
INSERT INTO order_items (order_id, product_id, batch_id, quantity, unit_price, total_price) VALUES
(1, 1, 1, 1, 899.99, 899.99),
(1, 3, 5, 1, 49.99, 49.99),
(2, 2, 3, 1, 1299.99, 1299.99),
(2, 5, 9, 1, 49.99, 49.99),
(2, 10, 17, 1, 14.99, 14.99),
(2, 13, 20, 1, 29.99, 29.99),
(3, 7, 13, 1, 79.99, 79.99),
(3, 11, 18, 1, 19.99, 19.99),
(3, 4, 7, 2, 24.99, 49.98),
(4, 9, 16, 1, 29.99, 29.99),
(4, 10, 17, 4, 14.99, 59.96),
(5, 14, 21, 1, 199.99, 199.99),
(5, 6, 11, 1, 29.99, 29.99);

-- Insert demo Payment Transactions
INSERT INTO payment_transactions (order_id, payment_method, amount, status, transaction_reference, payment_date) VALUES
(1, 'Stripe', 949.98, 'Completed', 'STRIPE-TXN-001', '2024-03-01 10:20:00'),
(2, 'SSL', 1374.98, 'Completed', 'SSL-TXN-001', '2024-03-05 14:35:00'),
(3, 'Bkash', 159.97, 'Completed', 'BKASH-TXN-001', '2024-03-10 09:50:00'),
(4, 'Stripe', 89.98, 'Pending', 'STRIPE-TXN-002', '2024-03-15 16:25:00'),
(5, 'SSL', 229.98, 'Refunded', 'SSL-TXN-002', '2024-03-20 11:10:00');

-- Insert demo Refunds
INSERT INTO refunds (order_id, transaction_id, amount, reason, status, processed_by) VALUES
(5, 5, 229.98, 'Order canceled due to incorrect address', 'Processed', 1);

-- Insert demo Stock Movements
INSERT INTO stock_movements (product_id, batch_id, quantity, movement_type, reference_id, reference_type, notes, created_by) VALUES
-- Initial stock from purchase orders
(1, 1, 30, 'Purchase', 1, 'PurchaseOrder', 'Initial stock', 1),
(1, 2, 20, 'Purchase', 2, 'PurchaseOrder', 'Restock', 1),
(2, 3, 15, 'Purchase', 1, 'PurchaseOrder', 'Initial stock', 1),
(2, 4, 15, 'Purchase', 2, 'PurchaseOrder', 'Restock', 1),
(3, 5, 50, 'Purchase', 1, 'PurchaseOrder', 'Initial stock', 1),
(3, 6, 50, 'Purchase', 2, 'PurchaseOrder', 'Restock', 1),
(4, 7, 100, 'Purchase', 3, 'PurchaseOrder', 'Initial stock', 1),
(4, 8, 100, 'Purchase', 3, 'PurchaseOrder', 'Restock', 1),
(5, 9, 75, 'Purchase', 3, 'PurchaseOrder', 'Initial stock', 1),
(5, 10, 75, 'Purchase', 3, 'PurchaseOrder', 'Restock', 1),

-- Order-related stock movements
(1, 1, -1, 'Sale', 1, 'Order', 'Order #1', 1),
(3, 5, -1, 'Sale', 1, 'Order', 'Order #1', 1),
(2, 3, -1, 'Sale', 2, 'Order', 'Order #2', 1),
(5, 9, -1, 'Sale', 2, 'Order', 'Order #2', 1),
(10, 17, -1, 'Sale', 2, 'Order', 'Order #2', 1),
(13, 20, -1, 'Sale', 2, 'Order', 'Order #2', 1),
(7, 13, -1, 'Sale', 3, 'Order', 'Order #3', 1),
(11, 18, -1, 'Sale', 3, 'Order', 'Order #3', 1),
(4, 7, -2, 'Sale', 3, 'Order', 'Order #3', 1),
(9, 16, -1, 'Sale', 4, 'Order', 'Order #4', 1),
(10, 17, -4, 'Sale', 4, 'Order', 'Order #4', 1),

-- Manual adjustments
(1, 1, -2, 'Adjustment', NULL, 'Manual', 'Damaged during handling', 1),
(7, 13, -1, 'Adjustment', NULL, 'Manual', 'Display unit', 1),
(10, 17, -5, 'Adjustment', NULL, 'Manual', 'Promotional giveaway', 1),

-- Returns
(14, 21, 1, 'Return', 5, 'Order', 'Order canceled', 1),
(6, 11, 1, 'Return', 5, 'Order', 'Order canceled', 1);






-- Drop existing users table if it exists (you'll need to drop any foreign key constraints first)
-- Note: In a production environment, you should first backup any data

-- First, drop foreign keys from tables that reference the users table
ALTER TABLE purchase_orders DROP FOREIGN KEY purchase_orders_ibfk_2;
ALTER TABLE refunds DROP FOREIGN KEY refunds_ibfk_3;
ALTER TABLE stock_movements DROP FOREIGN KEY stock_movements_ibfk_3;

-- Now drop and recreate the users table
DROP TABLE IF EXISTS users;

CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(100) NOT NULL UNIQUE,
    name VARCHAR(100),
    profile_image VARCHAR(255),
    oauth_provider ENUM('Google', 'Facebook', 'Local') NOT NULL,
    oauth_id VARCHAR(100),
    password VARCHAR(255),  -- Only used for local authentication
    role ENUM('Admin', 'Manager') NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    last_login TIMESTAMP NULL DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY unique_oauth (oauth_provider, oauth_id)
);

-- Insert demo Users with OAuth info
INSERT INTO users (email, name, profile_image, oauth_provider, oauth_id, password, role, last_login) VALUES
('admin@example.com', 'Admin User', 'https://example.com/profiles/admin.jpg', 'Google', '103984726598347265983', NULL, 'Admin', '2024-04-14 15:30:00'),
('manager@example.com', 'Manager User', 'https://example.com/profiles/manager.jpg', 'Facebook', '4857693847568374', NULL, 'Manager', '2024-04-14 10:15:00'),
('local.user@example.com', 'Local User', NULL, 'Local', NULL, '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Manager', '2024-04-13 16:45:00');

-- Re-add foreign key constraints
ALTER TABLE purchase_orders
ADD CONSTRAINT purchase_orders_ibfk_2
FOREIGN KEY (created_by) REFERENCES users(user_id);

ALTER TABLE refunds
ADD CONSTRAINT refunds_ibfk_3
FOREIGN KEY (processed_by) REFERENCES users(user_id);

ALTER TABLE stock_movements
ADD CONSTRAINT stock_movements_ibfk_3
FOREIGN KEY (created_by) REFERENCES users(user_id);


-- Create Sales Summary table (by date)
CREATE TABLE sales_summary (
    summary_id INT AUTO_INCREMENT PRIMARY KEY,
    date DATE NOT NULL,
    total_orders INT NOT NULL DEFAULT 0,
    total_sales DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    total_items INT NOT NULL DEFAULT 0,
    average_order_value DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY unique_date (date)
);

-- Create Category Sales table
CREATE TABLE category_sales (
    category_sales_id INT AUTO_INCREMENT PRIMARY KEY,
    date DATE NOT NULL,
    category_id INT NOT NULL,
    total_orders INT NOT NULL DEFAULT 0,
    total_sales DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    total_items INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY unique_category_date (category_id, date),
    FOREIGN KEY (category_id) REFERENCES categories(category_id)
);

-- Insert demo data for Sales Summary (March 2024)
INSERT INTO sales_summary (date, total_orders, total_sales, total_items, average_order_value) VALUES
('2024-03-01', 3, 1249.97, 5, 416.66),
('2024-03-02', 2, 899.98, 3, 449.99),
('2024-03-03', 4, 1599.96, 8, 399.99),
('2024-03-04', 1, 479.99, 2, 479.99),
('2024-03-05', 5, 2374.95, 12, 474.99),
('2024-03-06', 2, 899.98, 4, 449.99),
('2024-03-07', 3, 1349.97, 6, 449.99),
('2024-03-08', 2, 779.98, 5, 389.99),
('2024-03-09', 1, 479.99, 2, 479.99),
('2024-03-10', 4, 1599.96, 9, 399.99),
('2024-03-11', 3, 1149.97, 5, 383.32),
('2024-03-12', 2, 779.98, 4, 389.99),
('2024-03-13', 1, 329.99, 1, 329.99),
('2024-03-14', 3, 1149.97, 6, 383.32),
('2024-03-15', 5, 2249.95, 10, 449.99),
('2024-03-16', 2, 899.98, 3, 449.99),
('2024-03-17', 1, 449.99, 1, 449.99),
('2024-03-18', 3, 1349.97, 5, 449.99),
('2024-03-19', 2, 899.98, 4, 449.99),
('2024-03-20', 4, 1499.96, 7, 374.99),
('2024-03-21', 3, 1149.97, 6, 383.32),
('2024-03-22', 1, 329.99, 1, 329.99),
('2024-03-23', 2, 779.98, 3, 389.99),
('2024-03-24', 4, 1699.96, 8, 424.99),
('2024-03-25', 3, 1249.97, 6, 416.66),
('2024-03-26', 2, 899.98, 4, 449.99),
('2024-03-27', 1, 479.99, 2, 479.99),
('2024-03-28', 3, 1149.97, 6, 383.32),
('2024-03-29', 2, 779.98, 4, 389.99),
('2024-03-30', 4, 1699.96, 8, 424.99),
('2024-03-31', 5, 2249.95, 11, 449.99);

-- Insert February data for month-to-month comparison
INSERT INTO sales_summary (date, total_orders, total_sales, total_items, average_order_value) VALUES
('2024-02-01', 2, 899.98, 4, 449.99),
('2024-02-02', 1, 479.99, 2, 479.99),
('2024-02-03', 3, 1249.97, 6, 416.66),
('2024-02-04', 2, 899.98, 3, 449.99),
('2024-02-05', 1, 449.99, 1, 449.99),
('2024-02-06', 2, 899.98, 4, 449.99),
('2024-02-07', 3, 1149.97, 5, 383.32),
('2024-02-08', 2, 779.98, 3, 389.99),
('2024-02-09', 1, 329.99, 1, 329.99),
('2024-02-10', 4, 1399.96, 7, 349.99),
('2024-02-11', 2, 779.98, 4, 389.99),
('2024-02-12', 1, 329.99, 1, 329.99),
('2024-02-13', 2, 899.98, 4, 449.99),
('2024-02-14', 5, 2249.95, 10, 449.99),
('2024-02-15', 3, 1149.97, 5, 383.32),
('2024-02-16', 2, 779.98, 3, 389.99),
('2024-02-17', 1, 329.99, 1, 329.99),
('2024-02-18', 3, 1149.97, 6, 383.32),
('2024-02-19', 2, 779.98, 4, 389.99),
('2024-02-20', 3, 1149.97, 6, 383.32),
('2024-02-21', 1, 329.99, 1, 329.99),
('2024-02-22', 2, 779.98, 3, 389.99),
('2024-02-23', 3, 1149.97, 5, 383.32),
('2024-02-24', 2, 899.98, 4, 449.99),
('2024-02-25', 1, 479.99, 2, 479.99),
('2024-02-26', 2, 899.98, 4, 449.99),
('2024-02-27', 3, 1249.97, 6, 416.66),
('2024-02-28', 2, 779.98, 3, 389.99),
('2024-02-29', 4, 1599.96, 7, 399.99);

-- Insert demo data for Category Sales (March 2024)
-- Category 1: Electronics
INSERT INTO category_sales (date, category_id, total_orders, total_sales, total_items) VALUES
('2024-03-01', 1, 2, 999.98, 2),
('2024-03-02', 1, 1, 649.99, 1),
('2024-03-03', 1, 2, 1299.98, 3),
('2024-03-04', 1, 1, 429.99, 1),
('2024-03-05', 1, 3, 1649.97, 4),
('2024-03-06', 1, 1, 649.99, 1),
('2024-03-07', 1, 2, 1099.98, 2),
('2024-03-08', 1, 1, 429.99, 1),
('2024-03-09', 1, 1, 429.99, 1),
('2024-03-10', 1, 2, 1099.98, 3),
('2024-03-11', 1, 1, 649.99, 1),
('2024-03-12', 1, 1, 429.99, 1),
('2024-03-13', 1, 1, 329.99, 1),
('2024-03-14', 1, 1, 649.99, 1),
('2024-03-15', 1, 3, 1649.97, 4),
('2024-03-16', 1, 1, 649.99, 1),
('2024-03-17', 1, 1, 429.99, 1),
('2024-03-18', 1, 2, 1099.98, 3),
('2024-03-19', 1, 1, 649.99, 1),
('2024-03-20', 1, 2, 979.98, 2),
('2024-03-21', 1, 1, 649.99, 1),
('2024-03-22', 1, 1, 329.99, 1),
('2024-03-23', 1, 1, 429.99, 1),
('2024-03-24', 1, 2, 1099.98, 3),
('2024-03-25', 1, 2, 999.98, 2),
('2024-03-26', 1, 1, 649.99, 1),
('2024-03-27', 1, 1, 429.99, 1),
('2024-03-28', 1, 1, 649.99, 1),
('2024-03-29', 1, 1, 429.99, 1),
('2024-03-30', 1, 2, 1099.98, 3),
('2024-03-31', 1, 3, 1649.97, 4);

-- Category 2: Clothing
INSERT INTO category_sales (date, category_id, total_orders, total_sales, total_items) VALUES
('2024-03-01', 2, 1, 124.99, 2),
('2024-03-02', 2, 1, 149.99, 1),
('2024-03-03', 2, 1, 99.98, 2),
('2024-03-05', 2, 1, 224.99, 3),
('2024-03-07', 2, 1, 149.99, 2),
('2024-03-08', 2, 1, 149.99, 2),
('2024-03-10', 2, 1, 124.99, 2),
('2024-03-11', 2, 1, 149.99, 2),
('2024-03-12', 2, 1, 149.99, 2),
('2024-03-14', 2, 1, 124.99, 2),
('2024-03-15', 2, 1, 149.99, 2),
('2024-03-18', 2, 1, 149.99, 1),
('2024-03-19', 2, 1, 149.99, 2),
('2024-03-20', 2, 1, 149.99, 2),
('2024-03-21', 2, 1, 124.99, 2),
('2024-03-23', 2, 1, 149.99, 1),
('2024-03-24', 2, 1, 124.99, 2),
('2024-03-25', 2, 1, 149.99, 2),
('2024-03-26', 2, 1, 149.99, 2),
('2024-03-28', 2, 1, 124.99, 2),
('2024-03-29', 2, 1, 149.99, 2),
('2024-03-30', 2, 1, 124.99, 2),
('2024-03-31', 2, 1, 149.99, 2);

-- Category 3: Home & Kitchen
INSERT INTO category_sales (date, category_id, total_orders, total_sales, total_items) VALUES
('2024-03-01', 3, 1, 79.99, 1),
('2024-03-03', 3, 1, 109.98, 2),
('2024-03-04', 3, 0, 0, 0),
('2024-03-05', 3, 1, 169.98, 3),
('2024-03-06', 3, 1, 109.98, 2),
('2024-03-07', 3, 0, 0, 0),
('2024-03-08', 3, 1, 109.98, 2),
('2024-03-10', 3, 1, 169.98, 3),
('2024-03-11', 3, 1, 169.98, 2),
('2024-03-14', 3, 1, 169.98, 2),
('2024-03-15', 3, 1, 169.98, 2),
('2024-03-16', 3, 1, 109.98, 1),
('2024-03-18', 3, 0, 0, 0),
('2024-03-20', 3, 1, 169.98, 2),
('2024-03-21', 3, 1, 169.98, 2),
('2024-03-24', 3, 1, 169.98, 2),
('2024-03-25', 3, 0, 0, 0),
('2024-03-27', 3, 0, 0, 0),
('2024-03-28', 3, 1, 169.98, 2),
('2024-03-30', 3, 1, 169.98, 2),
('2024-03-31', 3, 1, 169.98, 3);

-- Category 4: Books
INSERT INTO category_sales (date, category_id, total_orders, total_sales, total_items) VALUES
('2024-03-01', 4, 0, 0, 0),
('2024-03-02', 4, 1, 59.97, 1),
('2024-03-03', 4, 1, 44.97, 1),
('2024-03-05', 4, 1, 74.96, 2),
('2024-03-06', 4, 1, 59.97, 1),
('2024-03-10', 4, 1, 59.97, 1),
('2024-03-12', 4, 1, 74.96, 1),
('2024-03-15', 4, 1, 59.97, 1),
('2024-03-16', 4, 1, 59.97, 1),
('2024-03-19', 4, 0, 0, 0),
('2024-03-20', 4, 1, 44.97, 1),
('2024-03-23', 4, 1, 74.96, 1),
('2024-03-24', 4, 1, 59.97, 1),
('2024-03-25', 4, 0, 0, 0),
('2024-03-26', 4, 0, 0, 0),
('2024-03-29', 4, 1, 74.96, 1),
('2024-03-30', 4, 1, 59.97, 1),
('2024-03-31', 4, 1, 59.97, 2);

-- Category 5: Sports & Outdoors
INSERT INTO category_sales (date, category_id, total_orders, total_sales, total_items) VALUES
('2024-03-02', 5, 0, 0, 0),
('2024-03-03', 5, 1, 44.99, 0),
('2024-03-04', 5, 1, 29.99, 1),
('2024-03-05', 5, 1, 229.98, 0),
('2024-03-06', 5, 0, 0, 0),
('2024-03-07', 5, 1, 29.99, 1),
('2024-03-09', 5, 0, 0, 0),
('2024-03-10', 5, 1, 29.99, 0),
('2024-03-13', 5, 0, 0, 0),
('2024-03-15', 5, 1, 199.99, 1),
('2024-03-17', 5, 0, 0, 0),
('2024-03-18', 5, 1, 29.99, 1),
('2024-03-20', 5, 1, 29.99, 0),
('2024-03-22', 5, 0, 0, 0),
('2024-03-24', 5, 1, 29.99, 0),
('2024-03-26', 5, 1, 29.99, 1),
('2024-03-27', 5, 1, 29.99, 1),
('2024-03-30', 5, 1, 29.99, 0),
('2024-03-31', 5, 1, 199.99, 0);

-- Add some February data for category 1 (Electronics) for comparison
INSERT INTO category_sales (date, category_id, total_orders, total_sales, total_items) VALUES
('2024-02-01', 1, 1, 649.99, 1),
('2024-02-02', 1, 1, 429.99, 1),
('2024-02-03', 1, 2, 999.98, 2),
('2024-02-04', 1, 1, 649.99, 1),
('2024-02-05', 1, 1, 429.99, 1),
('2024-02-06', 1, 1, 649.99, 1),
('2024-02-07', 1, 2, 999.98, 2),
('2024-02-08', 1, 1, 429.99, 1),
('2024-02-09', 1, 1, 329.99, 1),
('2024-02-10', 1, 2, 979.98, 2),
('2024-02-11', 1, 1, 429.99, 1),
('2024-02-12', 1, 1, 329.99, 1),
('2024-02-13', 1, 1, 649.99, 1),
('2024-02-14', 1, 3, 1649.97, 4),
('2024-02-15', 1, 1, 649.99, 1),
('2024-02-16', 1, 1, 429.99, 1),
('2024-02-17', 1, 1, 329.99, 1),
('2024-02-18', 1, 2, 999.98, 2),
('2024-02-19', 1, 1, 429.99, 1),
('2024-02-20', 1, 2, 999.98, 2),
('2024-02-21', 1, 1, 329.99, 1),
('2024-02-22', 1, 1, 429.99, 1),
('2024-02-23', 1, 2, 999.98, 2),
('2024-02-24', 1, 1, 649.99, 1),
('2024-02-25', 1, 1, 429.99, 1),
('2024-02-26', 1, 1, 649.99, 1),
('2024-02-27', 1, 2, 999.98, 2),
('2024-02-28', 1, 1, 429.99, 1),
('2024-02-29', 1, 2, 979.98, 2);



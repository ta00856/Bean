import mysql.connector
from config import get_db_connection

# Establish connection to the database
connection = get_db_connection()

# Create a cursor object
cursor = connection.cursor()

# SQL query to create the `users` table
create_users_table = """
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL
);
"""

# Execute the query to create the table
cursor.execute(create_users_table)

# Commit the changes
connection.commit()

# Close the cursor and connection
cursor.close()
connection.close()

print("Users table created successfully!")

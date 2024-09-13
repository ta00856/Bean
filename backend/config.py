# config.py

import mysql.connector

def get_db_connection():
    connection = mysql.connector.connect(
        host='127.0.0.1',
        user='root',
        password='Kzzs@022704',
        database='Bean'
    )
    return connection


def create_users_table():
    connection = get_db_connection()
    cursor = connection.cursor()

    # Check if the table exists, if not, create it
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) NOT NULL,
        password VARCHAR(255) NOT NULL,
        phone VARCHAR(20) NOT NULL
    );
    """)
    connection.commit()
    cursor.close()
    connection.close()
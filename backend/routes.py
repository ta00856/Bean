from flask import Blueprint, request, jsonify
from config import get_db_connection

user_bp = Blueprint('user', __name__)

@user_bp.route('/signup', methods=['POST'])
def signup():
    data = request.json
    email = data.get('email')
    password = data.get('password')
    phone = data.get('phone')

    if not email or not password or not phone:
        return jsonify({"error": "Missing required fields"}), 400

    try:
        connection = get_db_connection()
        cursor = connection.cursor()
        
        # Insert into users table
        query = "INSERT INTO users (email, password, phone) VALUES (%s, %s, %s)"
        cursor.execute(query, (email, password, phone))
        connection.commit()
        
        return jsonify({"message": "User registered successfully"}), 201
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": "Something went wrong"}), 500
    finally:
        cursor.close()
        connection.close()

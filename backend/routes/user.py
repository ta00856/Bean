from flask import Blueprint, request
from config import get_db_connection

user_bp = Blueprint('user', __name__)

@user_bp.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    email = data['email']
    password = data['password']
    phone = data['phone']

    connection = get_db_connection()
    cursor = connection.cursor()

    query = "INSERT INTO users (email, password, phone) VALUES (%s, %s, %s)"
    cursor.execute(query, (email, password, phone))
    connection.commit()

    cursor.close()
    connection.close()

    return {"message": "User signed up successfully!"}, 201

from flask import Flask
from routes.user import user_bp  # Import the user Blueprint
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

# Register the Blueprint for users
app.register_blueprint(user_bp)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True)

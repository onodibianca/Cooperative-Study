from flask import Flask, jsonify
from datetime import timedelta
from configure_db import db, jwt
from flask_cors import CORS

from flask_jwt_extended import JWTManager
from model.user_entity import User
from routes.file_routes import file_bp
from routes.auth_routes import auth_bp
from routes.annotation_routes import annotations_bp

app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://bt_user:asdf1234@localhost:3306/bachelor_thesis_py_re'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = '9c55f1a1e5d7d40b6fecd7d5c5d9feff98d289bf97c8b4fb3a8c08a15e1b7e39'
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=1)

db.init_app(app)
jwt.init_app(app)

app.register_blueprint(auth_bp, url_prefix='/auth')
app.register_blueprint(file_bp, url_prefix="/api")
app.register_blueprint(annotations_bp, url_prefix='/annotations')

CORS(app, resources={r"/*": {"origins": "*"}})

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)
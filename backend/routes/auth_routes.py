from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token,jwt_required,get_jwt_identity
from model.user_entity import User
from configure_db import db

auth_bp = Blueprint('auth', __name__)

# REGISTER
@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    #In case one of thhe fields is empty
    if not username or not password:
        return jsonify({"msg": "Username and password required"}), 400

    #In case the username is already beign used
    if User.query.filter_by(username=username).first():
        return jsonify({"msg": "Username already exists"}), 409

    hashed_password = generate_password_hash(password)
    new_user = User(username=username, password=hashed_password)
    db.session.add(new_user)
    db.session.commit()

    access_token = create_access_token(identity=str(new_user.id))

    return jsonify({"access_token": access_token, "msg": "Registered succesfully!"}),200

#LOGIN
@auth_bp.route('/login', methods=['POST'])
def login():
    if not request.is_json:
        return jsonify({"msg": "Missing JSON in request"}), 400

    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify({"msg": "Username and password are required"}), 400

    user = User.query.filter_by(username=username).first()

    if not user or not check_password_hash(user.password, password):
        return jsonify({"msg": "Invalid username or password"}), 401

    access_token = create_access_token(identity=str(user.id))

    return jsonify({"access_token": access_token, "msg": "Logged in!"}),200

#DELETE account
@auth_bp.route('/delete', methods=['DELETE'])
@jwt_required()
def delete_account():

    user_id=int(get_jwt_identity())
    user=User.query.get_or_404(user_id)

    if not user:
        return jsonify({"msg":"User nto found"}), 404
    
    try:
        db.session.delete(user)
        db.session.commit()
        return jsonify({ "msg":"User and all their related content deleted"}),200
    
    except Exception as e:
        db.session.rollback()
        print("Failed to delete user:{e}")
        return jsonify({"msg":"faile dto delete user", "error": str(e)}),500

from flask import Blueprint, request, jsonify, send_file
from flask_jwt_extended import jwt_required, get_jwt_identity
from configure_db import db
from model.file_entity import File 
import os
from werkzeug.utils import secure_filename

file_bp = Blueprint('files', __name__)

UPLOAD_FOLDER = 'uploaded_files'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

#GET ALL FILES
@file_bp.route('/files', methods=['GET'])
@jwt_required()
def get_all_files():
    user_id=int(get_jwt_identity())
    result=[]
    files = File.query.filter_by(user_id=user_id).all()

    for f in files:
        result.append({
                'id': f.id,
                'filename': f.filename,
                'stored_path': f.stored_path,
                'upload_date': f.upload_date.strftime('%Y-%m-%d') if f.upload_date else None
            })
    return jsonify(result), 200


#GET ONE FILE

@file_bp.route('/files/<int:file_id>', methods=['GET'])
@jwt_required()
def get_file(file_id):
    user_id = int(get_jwt_identity())
    file_record = File.query.filter_by(id=file_id, user_id=user_id).first()

    if not file_record or not os.path.exists(file_record.stored_path):
        return jsonify({'msg': 'File not found'}), 404

    # Render in browser instead of downloading
    return send_file(file_record.stored_path, as_attachment=False)


#DOWNLOAD FILE 
@file_bp.route('/files/<int:file_id>/download', methods=['GET'])
@jwt_required()
def download_file(file_id):
    user_id = int(get_jwt_identity())
    file_record = File.query.filter_by(id=file_id, user_id=user_id).first()

    if not file_record or not os.path.exists(file_record.stored_path):
        return jsonify({'msg': 'File not found'}), 404

    return send_file(file_record.stored_path, as_attachment=True)


#UPLOAD A NEW FILE
@file_bp.route('/files', methods=['POST'])
@jwt_required()
def upload_file():
    user_id = int(get_jwt_identity())

    if 'file' not in request.files:
        return jsonify({'msg': 'No file part in request'}), 400
    
    file = request.files['file']

    if file.filename == '':
        return jsonify({'msg': 'No selected file'}), 400
    
    if not file.filename.endswith('.txt'):
        return jsonify({'msg': 'Only .txt files are allowed'}), 400
    
    #secure file name
    filename = secure_filename(file.filename)
    file_path = os.path.join(UPLOAD_FOLDER, filename)

    file.save(file_path)

    new_file = File(
        filename=filename,
        stored_path=file_path,
        user_id=user_id
    )

    db.session.add(new_file)
    db.session.commit()

    return jsonify({"msg": "File uploaded!"}), 201

#DELETE FILE
@file_bp.route('/files/<int:file_id>', methods=['DELETE'])
@jwt_required()
def delete_file(file_id):
    user_id = int(get_jwt_identity())
    file_record = File.query.filter_by(id=file_id, user_id=user_id).first()

    if not file_record:
        return jsonify({'msg': 'File not found'}), 404

    # Delete file from disk
    try:
        if os.path.exists(file_record.stored_path):
            os.remove(file_record.stored_path)
    except Exception as e:
        return jsonify({'msg': 'Error deleting file from server', 'error': str(e)}), 500

    # Delete from DB
    db.session.delete(file_record)
    db.session.commit()

    return jsonify({'msg': 'File deleted successfully'}), 200


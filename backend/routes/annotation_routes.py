from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from configure_db import db
from model.annotation_entity import Annotation
from model.file_entity import File
from model.user_entity import User

annotations_bp = Blueprint('annotations', __name__)

# Create annotation
@annotations_bp.route('/', methods=['POST'])
@jwt_required()
def create_annotation():
    user_id = int(get_jwt_identity())
    data = request.get_json()

    file_id = data.get('file_id')
    selected_text = data.get('selected_text')
    note = data.get('note')

    if not file_id or not selected_text or not note:
        return jsonify({"msg": "file_id, selected_text and note are required"}), 400

    file = File.query.get(file_id)
    if not file:
        return jsonify({"msg": "File not found"}), 404

    new_annotation = Annotation(
        file_id=file_id,
        user_id=user_id,
        selected_text=selected_text,
        note=note
    )
    db.session.add(new_annotation)
    db.session.commit()

    return jsonify({
        "msg": "Annotation created",
        "annotation": {
            "id": new_annotation.id,
            "file_id": new_annotation.file_id,
            "user_id": new_annotation.user_id,
            "selected_text": new_annotation.selected_text,
            "note": new_annotation.note,
            "created_at": new_annotation.created_at.isoformat()
        }
    }), 201


@annotations_bp.route('/file/<int:file_id>', methods=['GET'])
@jwt_required()
def get_annotations_for_file(file_id):
    user_id = int(get_jwt_identity())
    annotations = Annotation.query.filter_by(file_id=file_id).all()

    result = []
    for a in annotations:
        user = User.query.get(a.user_id)  # Fetch user by user_id
        username = user.username if user else "Unknown"
        result.append({
            "id": a.id,
            "file_id": a.file_id,
            "user_id": a.user_id,
            "username": username,  # Add username here
            "selected_text": a.selected_text,
            "note": a.note,
            "created_at": a.created_at.isoformat()
        })

    return jsonify(result), 200


# Update an annotation by id (only owner)
@annotations_bp.route('/<int:annotation_id>', methods=['PUT'])
@jwt_required()
def update_annotation(annotation_id):
    user_id = int(get_jwt_identity())
    annotation = Annotation.query.get(annotation_id)

    if not annotation:
        return jsonify({"msg": "Annotation not found"}), 404

    if annotation.user_id != user_id:
        return jsonify({"msg": "Unauthorized"}), 403

    data = request.get_json()
    note = data.get('note')
    if note:
        annotation.note = note
        db.session.commit()

    return jsonify({"msg": "Annotation updated", "annotation": {
        "id": annotation.id,
        "note": annotation.note
    }}), 200


# Delete an annotation by id (only owner)
@annotations_bp.route('/<int:annotation_id>', methods=['DELETE'])
@jwt_required()
def delete_annotation(annotation_id):
    user_id = int(get_jwt_identity())
    annotation = Annotation.query.get(annotation_id)

    if not annotation:
        return jsonify({"msg": "Annotation not found"}), 404

    if annotation.user_id != user_id:
        return jsonify({"msg": "Unauthorized"}), 403

    db.session.delete(annotation)
    db.session.commit()

    return jsonify({"msg": "Annotation deleted"}), 200

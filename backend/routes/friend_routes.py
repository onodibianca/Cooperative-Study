from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from model.user_entity import User
from model.firend_request_entity import FriendRequest
from model.friendship_entity import Friendship
from configure_db import db

friend_bp = Blueprint('friend', __name__)

# Send Friend Request
@friend_bp.route('/friend-request/send', methods=['POST'])
@jwt_required()
def send_friend_request_by_username():
    sender_id = int(get_jwt_identity())
    data = request.get_json()
    username = data.get("username")

    if not username:
        return jsonify({'error': 'Username is required.'}), 400

    receiver = User.query.filter_by(username=username).first()
    if not receiver:
        return jsonify({'error': 'User not found.'}), 404

    receiver_id = receiver.id

    if sender_id == receiver_id:
        return jsonify({'error': "Cannot send a request to yourself."}), 400

    if FriendRequest.query.filter_by(sender_id=sender_id, receiver_id=receiver_id).first():
        return jsonify({'error': "Request already sent."}), 400

    if Friendship.query.filter_by(user_id=sender_id, friend_id=receiver_id).first():
        return jsonify({'error': "Already friends."}), 400

    new_request = FriendRequest(sender_id=sender_id, receiver_id=receiver_id)
    db.session.add(new_request)
    db.session.commit()
    return jsonify({'msg': 'Friend request sent!'}), 200


# Accept Friend Request
@friend_bp.route('/friend-request/accept/<int:request_id>', methods=['POST'])
@jwt_required()
def accept_request(request_id):
    current_id = int(get_jwt_identity())
    fr = FriendRequest.query.get_or_404(request_id)

    if fr.receiver_id != current_id:
        return jsonify({'error': 'Unauthorized.'}), 403

    fr.accepted = True
    db.session.add(Friendship(user_id=fr.sender_id, friend_id=fr.receiver_id))
    db.session.add(Friendship(user_id=fr.receiver_id, friend_id=fr.sender_id))
    db.session.commit()

    return jsonify({'msg': 'Friend request accepted!'}), 200

# Delete/Reject Friend Request
@friend_bp.route('/friend-request/delete/<int:request_id>', methods=['DELETE'])
@jwt_required()
def delete_request(request_id):
    user_id = int(get_jwt_identity())
    fr = FriendRequest.query.get_or_404(request_id)

    if user_id not in [fr.sender_id, fr.receiver_id]:
        return jsonify({'error': 'Unauthorized.'}), 403

    db.session.delete(fr)
    db.session.commit()
    return jsonify({'msg': 'Friend request deleted/rejected.'}), 200

# List Friends
@friend_bp.route('/friends', methods=['GET'])
@jwt_required()
def list_friends():
    user_id = int(get_jwt_identity())
    friends = Friendship.query.filter_by(user_id=user_id).all()
    return jsonify([
        {"id": f.friend.id, "username": f.friend.username}
        for f in friends
    ])

# List Pending Friend Requests
@friend_bp.route('/friend-requests', methods=['GET'])
@jwt_required()
def list_friend_requests():
    user_id = int(get_jwt_identity())

    received = FriendRequest.query.filter_by(receiver_id=user_id, accepted=False).all()
    sent = FriendRequest.query.filter_by(sender_id=user_id, accepted=False).all()

    return jsonify({
        "received": [{"id": r.id, "from": r.sender.username} for r in received],
        "sent": [{"id": r.id, "to": r.receiver.username} for r in sent],
    })

# Remove Friend
@friend_bp.route('/friends/remove/<int:friend_id>', methods=['DELETE'])
@jwt_required()
def remove_friend(friend_id):
    user_id = int(get_jwt_identity())
    f1 = Friendship.query.filter_by(user_id=user_id, friend_id=friend_id).first()
    f2 = Friendship.query.filter_by(user_id=friend_id, friend_id=user_id).first()

    if not f1 or not f2:
        return jsonify({'error': 'Friendship not found.'}), 404

    db.session.delete(f1)
    db.session.delete(f2)
    db.session.commit()
    return jsonify({'msg': 'Friend removed.'}), 200

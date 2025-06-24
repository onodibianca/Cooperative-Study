from datetime import date
from configure_db import db

class FriendRequest(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    
    sender_id = db.Column(db.Integer, db.ForeignKey('user.id', ondelete="CASCADE"), nullable=False)
    receiver_id = db.Column(db.Integer, db.ForeignKey('user.id', ondelete="CASCADE"), nullable=False)
    
    accepted = db.Column(db.Boolean, default=False, nullable=False)
    sent_at = db.Column(db.DateTime, default=date.today, nullable=False)
    
    sender = db.relationship('User', foreign_keys=[sender_id], backref='sent_requests')
    receiver = db.relationship('User', foreign_keys=[receiver_id], backref='received_requests')
    
    def __repr__(self):
        return f'<FriendRequest from User {self.sender_id} to User {self.receiver_id} accepted={self.accepted}>'


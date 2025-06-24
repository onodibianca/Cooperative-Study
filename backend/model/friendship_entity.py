from datetime import date
from configure_db import db

class Friendship(db.Model):
    user_id = db.Column(db.Integer, db.ForeignKey('user.id', ondelete="CASCADE"), primary_key=True)
    friend_id = db.Column(db.Integer, db.ForeignKey('user.id', ondelete="CASCADE"), primary_key=True)
    
    created_at = db.Column(db.DateTime, default=date.today, nullable=False)
    
    user = db.relationship('User', foreign_keys=[user_id], backref='friendships')
    friend = db.relationship('User', foreign_keys=[friend_id])
    
    def __repr__(self):
        return f'<Friendship between User {self.user_id} and User {self.friend_id}>'
    

    
from datetime import date
from sqlalchemy.orm import backref
from configure_db import db

class Friendship(db.Model):
    user_id = db.Column(db.Integer, db.ForeignKey('user.id', ondelete="CASCADE"), primary_key=True)
    friend_id = db.Column(db.Integer, db.ForeignKey('user.id', ondelete="CASCADE"), primary_key=True)
    
    created_at = db.Column(db.DateTime, default=date.today, nullable=False)
    
    user = db.relationship(
        'User',
        foreign_keys=[user_id],
        backref=backref('friendships', cascade='all, delete-orphan')
    )
    friend = db.relationship(
        'User',
        foreign_keys=[friend_id]
        # No backref needed here since you didn't have one originally
    )
    
    def __repr__(self):
        return f'<Friendship between User {self.user_id} and User {self.friend_id}>'
    
    @staticmethod
    def get_mutual_friend_ids(user_id):
        friendships = Friendship.query.filter_by(user_id=user_id).all()
        return [f.friend_id for f in friendships]
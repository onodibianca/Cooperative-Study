from configure_db import db

from sqlalchemy.dialects.mysql import VARCHAR

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(VARCHAR(80, collation='utf8mb4_bin'), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)

    files = db.relationship('File', backref='user', lazy=True, cascade="all, delete-orphan")
    annotations = db.relationship('Annotation', backref='user', lazy=True, cascade="all, delete-orphan")
    
    def __repr__(self):
        return f'<User {self.username}>'

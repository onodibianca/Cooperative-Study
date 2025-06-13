
from datetime import date
from configure_db import db

class File(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    filename = db.Column(db.String(255), nullable=False)          
    stored_path = db.Column(db.String(500), nullable=False)        
    upload_date = db.Column(db.Date, nullable=False, default=date.today)

    user_id = db.Column(db.Integer, db.ForeignKey('user.id', ondelete="CASCADE"), nullable=False)
    annotations = db.relationship('Annotation', backref='file', lazy=True, cascade="all, delete-orphan")

    def __repr__(self):
        return f'<File {self.filename}>'
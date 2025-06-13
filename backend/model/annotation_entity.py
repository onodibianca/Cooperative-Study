from configure_db import db
from datetime import datetime

class Annotation(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    
    file_id = db.Column(db.Integer, db.ForeignKey('file.id', ondelete="CASCADE"), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id', ondelete="CASCADE"), nullable=False)
    
    selected_text = db.Column(db.Text, nullable=False)
    note = db.Column(db.Text, nullable=False)
    
    created_at = db.Column(db.DateTime, default=datetime.utcnow)


    def __repr__(self):
        return f'<Annotation by User {self.user_id} on File {self.file_id}>'

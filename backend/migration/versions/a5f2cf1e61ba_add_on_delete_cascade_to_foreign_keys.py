"""Add ON DELETE CASCADE to foreign keys

Revision ID: a5f2cf1e61ba
Revises: b3d3c51da895
Create Date: 2025-06-28 16:30:50.089510

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'a5f2cf1e61ba'
down_revision: Union[str, None] = 'b3d3c51da895'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = 'a5f2cf1e61ba'
down_revision = 'b3d3c51da895'
branch_labels = None
depends_on = None

def upgrade() -> None:
    with op.batch_alter_table('file') as batch_op:
        batch_op.drop_constraint('file_ibfk_1', type_='foreignkey')
        batch_op.create_foreign_key('file_ibfk_1', 'user', ['user_id'], ['id'], ondelete='CASCADE')

    with op.batch_alter_table('annotation') as batch_op:
        batch_op.drop_constraint('annotation_ibfk_1', type_='foreignkey')
        batch_op.create_foreign_key('annotation_ibfk_1', 'file', ['file_id'], ['id'], ondelete='CASCADE')

        batch_op.drop_constraint('annotation_ibfk_2', type_='foreignkey')
        batch_op.create_foreign_key('annotation_ibfk_2', 'user', ['user_id'], ['id'], ondelete='CASCADE')

    with op.batch_alter_table('friend_request') as batch_op:
        batch_op.drop_constraint('friend_request_ibfk_1', type_='foreignkey')
        batch_op.create_foreign_key('friend_request_ibfk_1', 'user', ['sender_id'], ['id'], ondelete='CASCADE')

        batch_op.drop_constraint('friend_request_ibfk_2', type_='foreignkey')
        batch_op.create_foreign_key('friend_request_ibfk_2', 'user', ['receiver_id'], ['id'], ondelete='CASCADE')

    with op.batch_alter_table('friendship') as batch_op:
        batch_op.drop_constraint('friendship_ibfk_1', type_='foreignkey')
        batch_op.create_foreign_key('friendship_ibfk_1', 'user', ['user_id'], ['id'], ondelete='CASCADE')

        batch_op.drop_constraint('friendship_ibfk_2', type_='foreignkey')
        batch_op.create_foreign_key('friendship_ibfk_2', 'user', ['friend_id'], ['id'], ondelete='CASCADE')


def downgrade() -> None:
    # Reverse the above: drop with ondelete cascade, recreate without it
    with op.batch_alter_table('file') as batch_op:
        batch_op.drop_constraint('file_ibfk_1', type_='foreignkey')
        batch_op.create_foreign_key('file_ibfk_1', 'user', ['user_id'], ['id'])

    with op.batch_alter_table('annotation') as batch_op:
        batch_op.drop_constraint('annotation_ibfk_1', type_='foreignkey')
        batch_op.create_foreign_key('annotation_ibfk_1', 'file', ['file_id'], ['id'])

        batch_op.drop_constraint('annotation_ibfk_2', type_='foreignkey')
        batch_op.create_foreign_key('annotation_ibfk_2', 'user', ['user_id'], ['id'])

    with op.batch_alter_table('friend_request') as batch_op:
        batch_op.drop_constraint('friend_request_ibfk_1', type_='foreignkey')
        batch_op.create_foreign_key('friend_request_ibfk_1', 'user', ['sender_id'], ['id'])

        batch_op.drop_constraint('friend_request_ibfk_2', type_='foreignkey')
        batch_op.create_foreign_key('friend_request_ibfk_2', 'user', ['receiver_id'], ['id'])

    with op.batch_alter_table('friendship') as batch_op:
        batch_op.drop_constraint('friendship_ibfk_1', type_='foreignkey')
        batch_op.create_foreign_key('friendship_ibfk_1', 'user', ['user_id'], ['id'])

        batch_op.drop_constraint('friendship_ibfk_2', type_='foreignkey')
        batch_op.create_foreign_key('friendship_ibfk_2', 'user', ['friend_id'], ['id'])

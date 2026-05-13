"""add email and role to chat messages

Revision ID: c9dcc088ee5f
Revises:
Create Date: 2026-05-13 11:12:57.726136

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'c9dcc088ee5f'
down_revision: Union[str, Sequence[str], None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:

    op.add_column(
        'chat_messages',
        sa.Column(
            'email',
            sa.String(),
            nullable=True
        )
    )

    op.add_column(
        'chat_messages',
        sa.Column(
            'role',
            sa.String(),
            nullable=True
        )
    )


def downgrade() -> None:

    op.drop_column(
        'chat_messages',
        'role'
    )

    op.drop_column(
        'chat_messages',
        'email'
    )
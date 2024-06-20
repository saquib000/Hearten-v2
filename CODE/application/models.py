from flask_sqlalchemy import SQLAlchemy
from flask_security import UserMixin,RoleMixin

db = SQLAlchemy()

class RolesUsers(db.Model):
    __tablename__ = 'roles_users'
    id = db.Column(db.Integer(), primary_key=True)
    user_id = db.Column('user_id', db.Integer(), db.ForeignKey('user.id'))
    role_id = db.Column('role_id', db.Integer(), db.ForeignKey('role.id'))

class Role(db.Model,RoleMixin):
    __tablename__ = 'role'
    id = db.Column(db.Integer(), primary_key=True)
    name = db.Column(db.String(80), unique=True)
    description = db.Column(db.String(255))

class User(db.Model,UserMixin):
    __tablename__ = 'user'
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(255), unique=True)
    username = db.Column(db.String(255), unique=True, nullable=True)
    password = db.Column(db.String(255), nullable=False)
    last_login_at = db.Column(db.DateTime())
    active = db.Column(db.Boolean())    #for refrence only, not a real column (as its a boolean)
    fs_uniquifier = db.Column(db.String(64), unique=True, nullable=False)
    roles = db.relationship('Role', secondary='roles_users',
                         backref=db.backref('users', lazy='dynamic'))
    songs = db.relationship('Song',backref='creator')

class Song(db.Model):
    song_id = db.Column(db.Integer , primary_key=True)
    song_name = db.Column(db.String ,  nullable=False)
    lyrics = db.Column(db.Text ,  nullable=False)
    creator_id = db.Column(db.Integer, db.ForeignKey("user.id"))
    rating = db.Column(db.Float)
    date = db.Column(db.String)
    is_flagged=db.Column(db.Integer,default=0)
    filename=db.Column(db.String)

    ratings = db.relationship('Songrating', backref='song')

class Playlist(db.Model):
    playlist_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    playlist_name = db.Column(db.Text)
    p_userid = db.Column(db.Integer, db.ForeignKey('user.id'))
    p_songid = db.Column(db.Integer, db.ForeignKey('song.song_id'))

    # Relationship with the User table
    user = db.relationship('User', backref='playlists')

    # Relationship with the Song table
    songs = db.relationship('Song')


class Songrating(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    r_uid = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    r_sid = db.Column(db.Integer, db.ForeignKey('song.song_id'), nullable=False)
    rating = db.Column(db.Integer,nullable=False,default=0)

class Album(db.Model):
    album_id = db.Column(db.Integer, primary_key=True)
    album_name = db.Column(db.String, nullable=False)
    creator_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    song_id = db.Column(db.Integer, db.ForeignKey('song.song_id'))

    #relationships
    song = db.relationship('Song', backref='album')
    creator = db.relationship('User', backref='albums')

from main import app
from application.sec import  datastore as ds
from application.models import db,Role
from werkzeug.security import generate_password_hash

with app.app_context():
    db.create_all()
    
    ds.find_or_create_role(name='admin',description='user is admin')
    ds.find_or_create_role(name='creator',description='user is creator')
    ds.find_or_create_role(name='user',description='user is user')
    db.session.commit()

    if not ds.find_user(email='admin@email.com'):
        ds.create_user(email='admin@email.com',password=generate_password_hash('admin'),roles=['admin'])
    if not ds.find_user(email='creat1@email.com'):
        ds.create_user(email='creat1@email.com',password=generate_password_hash('creator1'),roles=['creator'],active=False)
    if not ds.find_user(email='user1@email.com'):
        ds.create_user(email='user1@email.com',password=generate_password_hash('user1'),roles=['user'])
    db.session.commit()



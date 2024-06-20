from flask import Flask
from application.models import db,User,Role
from config import DevConfig
from application.resources import api
from flask_security import Security
from application.sec import datastore
from application.instances import cache

def create_app():
    app = Flask(__name__)
    app.config.from_object(DevConfig)
    db.init_app(app)
    api.init_app(app)
    cache.init_app(app)
    
    app.security = Security(app,datastore)
    with app.app_context():
        import application.views

    return app

app = create_app()
# cel_app.conf.timezone = 'Asia/Kolkata'



if __name__ == '__main__':
    app.run(debug=True)
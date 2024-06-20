from flask import current_app as app,jsonify,request,render_template
from flask_security import roles_required, auth_required,current_user
from werkzeug.security import check_password_hash,generate_password_hash
from flask_restful import marshal,fields,marshal_with
from .models import User,db,Role,Song,Album
from .sec import datastore
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
from datetime import datetime
from application.instances import cache

@app.get('/')
def home():
    return render_template('index.html')

@app.get('/admin')
@auth_required("token")
@roles_required("admin")
def admin():
    return "Welcome admin"

@app.get('/activate/creator/<int:id>')
@auth_required("token")
@roles_required("admin")
def activate_creator(id):
    creator = User.query.get(id)
    if not creator or "creator" not in creator.roles:
        return jsonify({'message':'creator not found'}) , 404
    
    creator.active = True
    db.session.commit()
    return jsonify({'message':'creator activated'})

@app.get('/change_role')
@auth_required('token')
def change_role():
    try:
        user = current_user
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        datastore.remove_role_from_user(user, 'user')  
        datastore.add_role_to_user(user, 'creator')    

        db.session.commit()

        return jsonify({'message': 'Role changed successfully'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.get('/test')
@auth_required("token")
@roles_required("admin")
def test():
    return "test ok"

@app.post('/user-login')
def user_login():
    data = request.get_json()
    email = data.get('email')
    if not email:
        return jsonify({'msg':'email not provided'}) ,400
    
    user = datastore.find_user(email=email)
    if not user:
        return jsonify({'msg':'user not found'}) ,404
    
    if check_password_hash(user.password,data.get('password')):
        #add last_login of user to db
        user.last_login_at = datetime.now()  #UTC time
        datastore.commit() 
        return jsonify({'id':user.id,
                        'email':user.email,
                        'username':user.username,
                        'role':user.roles[0].name,
                        'active': user.active,
                        'token':user.get_auth_token()})
    else:
        return jsonify({'msg':'wrong password'}), 400
    
@app.post('/admin-login')
def admin_login():
    data = request.get_json()
    email = data.get('email')
    # email = data.get('username')
    if not email:
        return jsonify({'msg':'email not provided'}) ,400
    
    user = datastore.find_user(email=email)
    if not user:
        return jsonify({'msg':'user not found'}) ,404
    
    if not user.has_role('admin'):
        return jsonify({'msg': 'Access denied. Only admins can log in here.'}), 403
    
    if check_password_hash(user.password,data.get('password')):
        # return user.get_auth_token()
        return jsonify({'id':user.id,
                        'email':user.email,
                        'username':user.username,
                        'role':user.roles[0].name,
                        'token':user.get_auth_token()})
    else:
        return jsonify({'msg':'wrong password'}), 400

@app.post('/register')
def register():
    data = request.get_json()
    email = data.get('email')
    username = data.get('username')
    password = data.get('password')
    
    #do validation cheks
    datastore.create_user(email=email,username=username,password=generate_password_hash(password),roles=['user'])
    db.session.commit()

    return {'msg':'user registered.'},200


@app.route('/users')
@cache.cached(timeout=300)
def get_all_users():
    users = User.query.all()
    users_data = []
    for user in users:
        user_data = {
            'id': user.id,
            'email': user.email,
            'username': user.username,
            'active': user.active,
            'roles': [role.name for role in user.roles][0]
        }
        users_data.append(user_data)
    return jsonify(users_data)


@app.route('/user/<int:user_id>')
def get_user(user_id):
    user = User.query.get(user_id)
    if user:
        user_data = {
            'id': user.id,
            'email': user.email,
            'username': user.username,
            'active': user.active,
            'roles': [role.name for role in user.roles]  # Extracting role names
        }
        return jsonify(user_data)
    else:
        return jsonify({'error': 'User not found'}), 404

@app.route('/stats')
@auth_required('token')
@roles_required('admin')
def get_stats():
    total_users = User.query.count()    
    total_creators = User.query.filter(User.roles.any(name='creator')).count()
    total_songs = Song.query.count()
    a1 = Album.query.all()
    total_albums=len(set([i.album_name for i in a1]))


    stats = {
        'total_users': total_users,
        'total_creators': total_creators,
        'total_songs': total_songs,
        'total_albums':total_albums
    }

    # #graphs
    top_5_songs = Song.query.order_by(Song.rating.desc()).limit(5).all()
    song_names = [i.song_name for i in top_5_songs if i.rating is not None ]
    song_ratings = [i.rating for i in top_5_songs if i.rating is not None ]


    plt.bar(song_names,song_ratings)

    plt.title('Popular Songs')
    plt.xlabel('Song Names')
    plt.ylabel('Ratings')

    plt.savefig('static/media/songs_graph.png')

    plt.close()

    return jsonify(stats)

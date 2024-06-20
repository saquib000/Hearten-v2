from flask import jsonify
from flask_restful import Resource, Api,reqparse,fields,marshal_with,marshal
from flask_security import auth_required, roles_required,current_user
from .models import Song,db,Playlist,User,Album,Songrating
from .instances import cache

api = Api(prefix='/api')

###################SONG APIS###################
#custom fiels 
class Creator(fields.Raw):
    def format(self,value):
        return value.username

#get requests
song_fields = {
    'song_id': fields.Integer,
    'song_name': fields.String,
    'lyrics':fields.String,
    'creator_id': fields.Integer,
    'date':fields.String,
    'empty_field':fields.String,
    'is_flagged':fields.Integer,
    'filename':fields.String,
    'rating':fields.Float,
    'creator':Creator
}

class SongsApi(Resource):
    # @cache.cached(timeout=60)
    @marshal_with(song_fields)
    # @auth_required('token')
    def get(self):
        all_songs = Song.query.all()
        return all_songs

api.add_resource(SongsApi,'/songs')


#post requests
parser = reqparse.RequestParser()
parser.add_argument('song_name',type=str,help='song_name is required ;should be a string')
parser.add_argument('lyrics',type=str,help='lyrics is required ;should be a string')
parser.add_argument('date',type=str,help='date should be a string')

parser.add_argument('playlist_name',type=str,help='playlist name should be a string')
parser.add_argument('checked_songs',type=int,action='append',help='list should not be empty')

parser.add_argument('album_name',type=str,help='album name should be a string')
parser.add_argument('album_name_new',type=str,help='album name should be a string')

parser.add_argument('search_by',type=str,help='serch_by should be a string')
parser.add_argument('search_query',type=str,help='query should be a string')

parser.add_argument('stars',type=str,help='stars should be from 1-5')

# parser.add_argument('creator_id',type=str,help='date should be a string')

class SongApi(Resource):
    #read
    # @auth_required('token')
    @marshal_with(song_fields)
    def get(self,song_id):
        song=Song.query.get(song_id)
        if song is not None:
            return song
        else:
            return {"msg":'song not found'},400

    #create
    @auth_required('token')
    @roles_required('creator')
    def post(Self):
        args = parser.parse_args()
        song = Song(song_name=args['song_name'],lyrics=args['lyrics'],date=args['date'],creator_id=current_user.id)
        db.session.add(song)
        db.session.commit()
        return {"message":"Song created."},201
    
    #update
    def put(self,song_id):
        args = parser.parse_args()
        song=Song.query.get(song_id)
        if song:
            song.song_name = args['song_name']
            song.lyrics = args['lyrics']
            song.date = args['date']
            db.session.commit()
            return {"message":"Song updated."},200
        else:
            return {"message":"Song not found."},400
        
    #delete
    def delete(self,song_id):
        song=Song.query.get(song_id)
        if song:
            #delete form album
            a1=Album.query.filter_by(song_id=song_id).all()
            for albums in a1: 
                db.session.delete(albums)
                
            #playlist
            p1=Playlist.query.filter_by(p_songid=song_id).all()
            for playlists in p1:
                db.session.delete(playlists)

            #rating
            r1=Songrating.query.filter_by(r_sid=song_id).all()
            for ratings in r1:
                db.session.delete(ratings)
                
            #song
            song=Song.query.get(song_id)
            db.session.delete(song)

            db.session.commit()
            return {"message":"deleted"},200
        else:
            return {"message":"song not found"},400
    
api.add_resource(SongApi,
                 '/song/<int:song_id>',
                 '/song/create/',
                 '/song/update/<int:song_id>',
                 '/song/delete/<int:song_id>')

###################RATING APIS###################

class SongRating(Resource):
    #reading rating
    def get(self,song_id):
        s1=Song.query.get(song_id)
        ratingCheck=Songrating.query.filter_by(r_sid=song_id,r_uid=current_user.id).first()
        
        if not ratingCheck:
            status="Not Rated"
            ratingValue=None

        else:
            status="Rated"
            ratingValue=ratingCheck.rating
        
        return jsonify({"username":current_user.id,
                        "rating":s1.rating,
                        "status":status,
                        "ratingValue":ratingValue
                        })

    #posing rating
    def post(self,song_id):
        s1=Song.query.get(song_id)
        args = parser.parse_args()
        
        ratingCheck=Songrating.query.filter_by(r_sid=song_id,r_uid=current_user.id).first()
          
        if ratingCheck:
            db.session.delete(ratingCheck)
            db.session.commit()

        r=Songrating(r_uid=current_user.id,r_sid=song_id,rating=args['stars'])
        db.session.add(r)
        db.session.commit()

        ratingList=s1.ratings    #list of Songrating objects

        sum_of_ratings = sum([i.rating for i in ratingList])     #rating from Songrating table
        average_rating = round(sum_of_ratings / len(ratingList) , 1 )             
        s1.rating = average_rating
        
        db.session.commit()

        return jsonify({"msg":"song rated."})
    
api.add_resource(SongRating,'/song-rating/<int:song_id>')


###################PLAYLIST APIS###################
class Playlists(Resource):
    def get(self):
            #user playlists
            u1=User.query.get(current_user.id)
            p1=u1.playlists
            playlist_names=set([i.playlist_name for i in p1])
            print(list(playlist_names))
            return {"playlist_names":list(playlist_names)}

api.add_resource(Playlists,"/playlists")


class PlaylistApi(Resource):
    #create 
    def post(self):
        args = parser.parse_args()
        checked_songs = args['checked_songs']
        print(checked_songs)

        if checked_songs is not None:
            for song_id in checked_songs:
                play = Playlist(playlist_name=args['playlist_name'],p_userid=current_user.id,p_songid=song_id)
                db.session.add(play)

            db.session.commit()
            return {"msg":"playlist created"},201
        else:
            return {"msg":"songs list (checked_songs) or playlist_name empty"},400
        
    #read 
    def get(self,playlist_name):
        playlist=Playlist.query.filter_by(p_userid=current_user.id,playlist_name=playlist_name)

        songs=[]

        for p in playlist:
            print(p)
            songs.append(p.songs)

        songs_data = []
        for song in songs:
            song_data = {
                'song_id': song.song_id,
                'lyrics': song.lyrics,
                'song_name': song.song_name,
                'creator_id': song.creator_id,
                'creator':song.creator.username
            }
            songs_data.append(song_data)

        return jsonify(songs_data)

    #delete
    def delete(self,playlist_name):
        p1 = Playlist.query.filter_by(playlist_name=playlist_name,p_userid=current_user.id).all()
        if p1:
            for playlist in p1: db.session.delete(playlist)
            db.session.commit()
            return jsonify({"msg":"playlist deleted"})
        else :
            return jsonify({"error:no playlist found"}),404
 
            
api.add_resource(PlaylistApi,'/playlist/create',
                 '/playlist/<string:playlist_name>',
                 '/playlist/delete/<string:playlist_name>')

###################---ALBUM APIs---###################

#All Albums
class Albums(Resource):
    def get(self):
        a1 = Album.query.all()
        Album_names=set([i.album_name for i in a1])
        print(list(Album_names))
        return {"album_names":list(Album_names)}
    
    #users albums
    def post(self):
        u1=User.query.get(current_user.id)
        # u1=User.query.get(14)
        a1=u1.albums
        album_names=set([i.album_name for i in a1])
        print(list(album_names))
        return {"album_names":list(album_names)}

api.add_resource(Albums,"/albums")



#Album CRUD

#get requests
album_fields = {
    'song_id': fields.List,
    'song_name': fields.String,
    'lyrics':fields.String,
    'creator_id': fields.Integer,
    'date':fields.String,
    'empty_field':fields.String,
    'is_flagged':fields.Integer,
    'filename':fields.String,
    'rating':fields.Float,
    'creator':Creator
}

class AlbumApi(Resource):
    #create 
    def post(self):
        args = parser.parse_args()
        checked_songs = args['checked_songs']
        print(checked_songs)

        if checked_songs is not None:
            for song_id in checked_songs:
                album = Album(album_name=args['album_name'],creator_id=current_user.id,song_id=song_id)
                db.session.add(album)

            db.session.commit()
            return {"msg":"album created"},201
        else:
            return {"msg":"songs list (checked_songs) or album_name empty"},400
        
    #read 
    def get(self,album_name):
        #for giving header of album.
        album_object = Album.query.filter_by(album_name=album_name).first()
        print(album_object)

        #not needed yet
        album = Album.query.filter_by(album_name=album_name).all()
        print(album)

        songs = [ i.song for i in album ]        #SOLVED: songs was not itratable in case of one song
        print(songs)

        return {"album_name":album_object.album_name,"creator_name":album_object.creator.username,"songids":[i.song_id for i in songs]}        
    
    #update
    # @auth_required('token')
    # @roles_required('creator')
    def put(self,album_name):
        args = parser.parse_args()
        checked_songs = args['checked_songs']
        # songs=Song.query.filter_by(creator_id=loginSession["userid"],is_flagged=0)

        #delete old album
        al=Album.query.filter_by(album_name=album_name).all()
        #delete all objects in al
        for album in al:
            db.session.delete(album)
        db.session.commit()

        #create new album
        new_album_name=args['album_name_new']
        songs=args['checked_songs']
        for id in songs:
            a1=Album(album_name=new_album_name,creator_id=current_user.id,song_id=id)
            db.session.add(a1)
            db.session.commit()
        return {"msg":"album updated"}
    
    def delete(delf,album_name):

        al=Album.query.filter_by(album_name=album_name).all()
        #delete all objects in al
        for album in al:
            db.session.delete(album)
        db.session.commit()
        return {"msg":'album deleted'}

    
 
            
api.add_resource(AlbumApi,
                 '/album/create',
                 '/album/<string:album_name>',
                 '/album/update/<string:album_name>',
                 '/album/delete/<string:album_name>')

        

###########-------------SEARCH----------###############
class Search(Resource):
    def post(self):
        args = parser.parse_args()
        search_by = args['search_by']
        search_query = args['search_query']

        if "*" in search_query[-1]: search_query = search_query.rstrip("*")


        #by Album
        if search_by =='album':
            albums = Album.query.filter(Album.album_name.ilike(f"%{search_query}%")).all()
            album_name = set([i.album_name for i in albums if albums])
            return jsonify({'album_names':list(album_name)})


        #by Song
        if search_by =='song':
            song_search = Song.query.filter(Song.song_name.ilike(f"%{search_query}%")).all()

            song_list=[ {
                    "song_name": song.song_name,
                    "song_id": song.song_id,
                    "creator_id": song.creator_id,
                    "creator":song.creator.username,
                    "lyrics": song.lyrics,

                }
                for song in song_search
            ]

            return (jsonify({"songs":song_list}))
        
        #by Artist
        if search_by =='artist':
            try:
                user = User.query.filter(User.username.ilike(f"%{search_query}%")).first()
                albums = user.albums
                album_name = set([i.album_name for i in albums if albums])
                return jsonify({'album_names':list(album_name)})
            except :
                return jsonify({'album_names':[]})
            
        
api.add_resource(Search,"/search")
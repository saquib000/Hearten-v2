import Home from './components/Home.js'
import Register from './components/Register.js'
import Login from './components/Login.js'
import Users from './components/Users.js'
import AllSongs from './components/AllSongs.js'
import Song from './components/Song.js'
import Song_Create from './components/Song_Create.js'
import SongUpdate from './components/SongUpdate.js'
import CreatorHome from './components/CreatorHome.js'
import PlaylistCreate from './components/PlaylistCreate.js'
import AllPlaylists from './components/AllPlaylists.js'
import Album from './components/Album.js'
import AlbumCreate from './components/AlbumCreate.js'
import AlbumUpdate from './components/AlbumUpdate.js'
import AdminLogin from './components/AdminLogin.js'
import SearchResult from './components/SearchResult.js'
import Playlist from './components/Playlist.js'
import Profile from './components/Profile.js'

const routes = [
    {path:'/', component:Home, name:'Home'},
    {path:'/register',component:Register,name:'Register'},
    {path:'/login', component:Login, name:'Login'},
    {path:'/users',component:Users},
    {path:'/profile/',component:Profile},

    {path:'/allsongs',component:AllSongs,name:'AllSongs'},
    {path:'/song/:id',component:Song},
    {path:'/song-create',component:Song_Create},    
    {path:'/song-update/:id',component:SongUpdate},

    {path:'/creator',component:CreatorHome},

    {path:'/playlist-create',component:PlaylistCreate},
    {path:'/playlist/:playlist_name',component:Playlist},

    {path:'/album/:album_name',component:Album},
    {path:'/album-create',component:AlbumCreate},
    {path:'/album-update/:album_name',component:AlbumUpdate},

    {path:'/admin-login',component:AdminLogin,name:'Admin-Login'},

    {path:"/search",component:SearchResult}


]

export default new VueRouter({
    routes,
})
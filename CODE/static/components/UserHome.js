import AllSongs from "./AllSongs.js"
import AllPlaylists from "./AllPlaylists.js"
import AllAlbums from "./AllAlbums.js"



export default {
    template : 
    `<div>
        <AllSongs />
        <AllPlaylists />
        <AllAlbums />
    </div>`,
    components: {
        AllSongs,
        AllPlaylists,
        AllAlbums,
    }

}
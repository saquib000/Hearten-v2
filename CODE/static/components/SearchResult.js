export default {
    template:
    `<div>

        <div>
        <select v-model="search_by" class="form-select">
            <option value="album">by Album name</option>
            <option value="song">by Song name</option>
            <option value="artist">by Artist name</option>
        </select>
        <input class="form-control me-2"  placeholder="Search" name="search_query" v-model="search_query" required>
        <button class="btn btn-outline-success" @click="search">Search</button>
        </div>

        search result:
        <div v-if='album_names'>

            <div id="search-album">
                <h3> Albums found: <i class="bi bi-collection-play"></i></h3>
                <table id="all-songs" class="table table-hover">
                <thead class="table-light">
                <tr>
                <th>Album name</th>
                <th>View</th>
                </tr>
                </thead>
                <tbody>
                
                <tr v-for="name in album_names">
                    <td>{{name}}</td>
                    <td>
                    <router-link :to="{ path: '/album/' + name }" class="btn btn-primary">View Album</router-link>
                    </td>
                </tr>
                
                </tbody>
                </table>
            </div>
        </div>

        
        <div v-if="songs" id="song_search_result">
            <h4>Songs found :</h4>
            <table id="search-songs" class="table table-hover">
            <thead class="table-light">
            <tr>
                <th>Song name</th>
                <th>Artist</th>
                <th>Lyrics</th>
            </tr>
            </thead>
            <tbody>
            
                <tr v-for="song in songs">
                <td>{{song.song_name}}</td>
                <td>{{song.creator}}</td>
                <td><router-link :to="{ path: '/song/' + song.song_id }" class="btn btn-primary">View Song</router-link></td>
                </tr>
    
            </tbody>
            </table>
        </div>

    </div>`,
    data() {
        return {
            id:localStorage.getItem('user-id'),
            token:localStorage.getItem('auth-token'),
            error:null,
            search_query:null,
            search_by:null,
            album_names:null,
            songs:null
        }
    },
    methods : {
        async search() {
            const resp = await fetch('/api/search',{
                method:"POST",
                headers: {
                    'Authentication-Token':this.token, 
                    'Content-Type':"application/json" 
                },
                body:JSON.stringify({"search_by":this.search_by,"search_query":this.search_query})
            })
            const data = await resp.json().catch((e)=>{})
            if (resp.ok) {
                this.album_names = data['album_names']
                this.songs = data['songs']
            } else {
                this.error = resp.status
            }
        }
    }
}
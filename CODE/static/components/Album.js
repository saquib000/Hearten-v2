export default{
    template:
    `<div>
        <div id="main-Album">
        <h3> Album: {{album_name}} | Artist: {{creator_name}}</h3>
        <div>
        
        <table id="all-songs" class="table table-hover">
            <thead class="table-light">
            <tr>
                <th>Song name</th>
                <th>Artist</th>
                <th>Play</th>
            </tr>
            </thead>
            <tbody>
            
            <tr v-for="Song in allSongs">
                    <td v-if="songids.includes(Song.song_id)">{{Song.song_name}}</td>
                    <td v-if="songids.includes(Song.song_id)">{{Song.creator}}</td>
                    <td v-if="songids.includes(Song.song_id)"><router-link :to="{ path: '/song/' + Song.song_id }" class="btn btn-primary">read lyrics</router-link></td>
            </tr>
            
            </tbody>
        </table>
        
        </div>
        </div>
        </div>
    </div>`,
    data() {
        return {
            album_name:null,
            creator_name:null,
            songids:[],
            allSongs:{}
        }
    },
    async beforeMount() {
        const res = await fetch(`/api/album/${this.$route.params.album_name}`,{
          headers:{
            "Authentication-Token":this.token,
            "Content-Type":"application/json"
          }
        })
        const data = await res.json().catch((e)=>{})
          if (res.ok) {
              this.album_name = data.album_name
              this.creator_name = data.creator_name
              this.songids = data.songids
          } else {
              this.error = res.status
          }
    },
    async mounted() {
        const resp = await fetch('/api/songs',{
            headers: {
                'Authentication-Token':this.token,
            },
        })
        const data = await resp.json().catch((e)=>{})
        if (resp.ok) {
            this.allSongs = data
        } else {
            this.error = resp.status
        }
    }
}
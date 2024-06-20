export default {
    template :
    `<div>

    <div id="welcome_msg">
        <h2>Welcome, {{this.username}} !</h2>
    </div>

    <div id="main-song">
        <h3> Playlist: {{this.playlist_name}}</h3>
            <div>
                <table id="all-songs" class="table table-hover">
                <thead class="table-light">
                <tr>
                    <th>Song name</th>
                    <th>Artist</th>
                    <th>Lyrics</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(song,index) in songs" :key="song.song_id">
                    <td>{{ song.song_name }} </td>
                    <td>{{ song.creator }}</td>
                    <td><router-link :to="{ path: '/song/' + song.song_id }" class="btn btn-primary">read lyrics</router-link></td>
                </tr>
                </tbody>
                </table>
            </div>
    </div>   

    </div>`,
    data() { return {
        token:localStorage.getItem('auth-token'),
        username:localStorage.getItem('username'),
        playlist_name: this.$route.params.playlist_name,
        songs:[]
        }
    },
    async beforeMount() {
        const res = await fetch(`/api/playlist/${this.$route.params.playlist_name}`,{
          headers:{
            "Authentication-Token":this.token,
            "Content-Type":"application/json"
          }
        })
        const data = await res.json().catch((e)=>{})
          if (res.ok) {
              this.songs = await data
          } else {
              this.error = res.status
          }
    },
}
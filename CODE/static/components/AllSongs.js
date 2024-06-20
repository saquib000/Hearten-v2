export default {
    template : 
    `<div>
        <div id="welcome_msg">
        <h2 class="display-2">Welcome, {{this.username}}!</h2>
        <br>
    </div>
    <div id="main-songs">
    <h4> All songs available</h4>
      <table id="all-songs" class="table table-hover">
      <thead class="table-light">
      <tr>
        <th>Song name</th>
        <th>Artist</th>
        <th>Lyrics</th>
      </tr>
      </thead>
      <tbody>
        <tr v-for="(song,index) in allSongs" :key="song.song_id">
          <td>{{ song.song_name }} </td>
          <td>{{ song.creator }}</td>
          <td><router-link :to="{ path: '/song/' + song.song_id }" class="btn btn-primary">read lyrics</router-link></td>
        </tr>
      </tbody>
      </table>

    </div>
    </div>`,

    data() { return {
        allSongs:[],
        token:localStorage.getItem('auth-token'),
        error:null,
        username:localStorage.getItem('username')
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
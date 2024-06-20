export default {
    template:
    `<div>
    <div id="main-songs">
    <h3> All songs</h3>
    <table id="all-songs" class="table table-hover">
    <thead class="table-light">
    <tr>
      <th>Song name</th>
      <th>View</th>
      <th>Actions</th>
    </tr>
    </thead>
    <tbody>

      <tr v-for="song in allSongs">
        <td>{{song.song_name}}</td>
        <td><router-link :to="{ path: '/song/' + song.song_id }" class="btn btn-primary">read lyrics</router-link></td>
       
        <td>
        <button @click="deleteSong(song.song_id)" class="btn btn-primary">Delete</button>
        </td>
      </tr>
    
    </tbody>
    </table>
  </div>
    </div>`,
    data() {
        return {
            allSongs:[]
        }
    },
    methods :{
      async deleteSong(song_id){
        const res2 = await fetch(`/api/song/delete/${song_id}`,{
          method:"DELETE",
          headers:{
            "Authentication-Token":this.token,
            "Content-Type":"application/json"
          }
        })
        const data2 = await res2.json().catch((e)=>{})
        if (res2.ok) {
            this.$router.go()
        } else {
            this.error = res2.status
        }
      }
    },
    async beforeMount() {
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
    },
}
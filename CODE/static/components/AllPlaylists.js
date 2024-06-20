//gives the USERs playlists
export default {
    template : 
    `<div>
    <div id="main-playlist">
    <h3>Your playlists <i class="bi bi-music-note-list"></i></h3>
    <router-link to="/playlist-create" class="btn btn-primary" role="button">Create a new playlsit</router-link>

    <table id="all-songs" class="table table-hover">
      <thead class="table-light">
      <tr>
          <th>Playlists</th>
          <th>Delete</th>
          <th>View</th>
      </tr>
      </thead>

      <tbody>  
      <tr v-for="name in AllplaylistsNames['playlist_names'] ">
        <td> {{name}}</td>
        <td>
          <button @click="deletePlaylist(name)" class="btn btn-primary">Delete</button>
        </td>
        <td><router-link :to="{ path: '/playlist/' + name }" class="btn btn-primary">View</router-link>
        </td>
      </tr>
      </tbody>

      </table>
  </div>
    </div>`,
    data() {
      return {
        token:localStorage.getItem("auth-token"),
        AllplaylistsNames:[],
      }
    },
    methods : {
      async deletePlaylist(playlist_name) {
        const res2 = await fetch(`/api/playlist/delete/${playlist_name}`,{
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
      const res = await fetch("/api/playlists",{
        headers:{
          "Authentication-Token":this.token,
          "Content-Type":"application/json"
        }
      })
      const data = await res.json().catch((e)=>{})
        if (res.ok) {
            this.AllplaylistsNames = data
        } else {
            this.error = res.status
        }
    }
}
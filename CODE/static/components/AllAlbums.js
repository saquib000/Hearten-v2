//all albums for user home
export default {
    template:
    `<div>
        <div id="main-albums">
        <h3> Explore Albums <i class="bi bi-collection-play"></i></h3>
        <table id="all-songs" class="table table-hover">
        <thead class="table-light">
        <tr>
        <th>Album name</th>

        <th>Actions</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="name in allAlbumNames['album_names'] ">
            <td>{{name}}</td>
            <td>
            <router-link :to="{ path: '/album/' + name }" class="btn btn-primary">View Album</router-link>
            </td>
        </tr>
        </tbody>
        </table>
        </div>
    </div>`,
    data() {
        return {
          token:localStorage.getItem("auth-token"),
          allAlbumNames:[],
        }
      },
      async beforeMount() {
        const res = await fetch("/api/albums",{
          headers:{
            "Authentication-Token":this.token,
            "Content-Type":"application/json"
          }
        })
        const data = await res.json().catch((e)=>{})
          if (res.ok) {
              this.allAlbumNames = data
          } else {
              this.error = res.status
          }
      }
}
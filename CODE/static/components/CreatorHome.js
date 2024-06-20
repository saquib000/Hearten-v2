export default {
    template : 
    `<div>

    <div v-if=" role=='creator' || role=='admin' ">
        <div id="welcome_msg">
            <h2 class="display-2">Welcome, {{username}}!</h2>
            <br>
        </div>

        <div id="main-songs">
            <div>
                Upload song : <router-link to='/song-create' class='btn btn-primary'>Upload</router-link>
            <h3>Your songs</h3>
            </div>
            <table id="all-songs" class="table table-hover">
            <thead class="table-light">
            <tr>
                <th>Song name</th>
                <th>Actions</th>
            </tr>
            </thead>
            <tbody>
                <tr v-for="(song,index) in allSongs" :key="song.song_id">
                    <td v-if="song.creator_id==id"> {{ song.song_name }} </td>
                    <td v-if="song.creator_id==id">
                        <router-link :to="{ path: '/song/' + song.song_id }" class="btn btn-primary">read lyrics</router-link>
                        <router-link :to="{ path: '/song-update/' + song.song_id }" class="btn btn-primary">Update</router-link>
                        <button @click="deleteSong(song.song_id)" class="btn btn-primary">Delete</button>
                    </td>
                </tr>
            </tbody>
            </table>
        </div>


        <div id="main-albums">
        <div>
        <router-link to='/album-create' class='btn btn-primary'>Create Album</router-link>
        </div>

        <h3> Your Albums <i class="bi bi-collection-play"></i></h3>
        <table id="all-songs" class="table table-hover">
        <thead class="table-light">
        <tr>
        <th>Album name</th>

        <th>View</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="name in allAlbumNames['album_names'] ">
            <td>{{name}}</td>
            <td>
            <router-link :to="{ path: '/album/' + name }" class="btn btn-primary">View Album</router-link>
            <router-link :to="{ path: '/album-update/' + name }" class="btn btn-primary">Update Album</router-link>
            <button class="btn btn-primary" @click="deleteAlbum(name)"> Delete Album </button>
            </td>

        </tr>
        </tbody>
        </table>
        </div>
    </div>

    <div v-else>
        <h3>You are not authorised to view this page</h3>
        <div class="alert alert-danger" role="alert">
            You are not registered as creator yet.
        </div>
        <button class="btn btn-primary" @click="creator">Register as Creator</Button>

    </div>

    </div>`,

    data() { return {
        id:localStorage.getItem('user-id'),
        username:localStorage.getItem('username'),
        role:localStorage.getItem('role'),
        token:localStorage.getItem('auth-token'),
        allSongs:[],

        allAlbumNames:[],
        userAlbums:[],
        tempAlbums:[]

        
        }
    },

    //allsongs
    async beforeMount() {
        //allsongs
        const res1 = await fetch('/api/songs',{
            headers: {
                'Authentication-Token':this.token,  
            },
        })
        const data1 = await res1.json().catch((e)=>{})
        if (res1.ok) {
            this.allSongs = data1
        } else {
            this.error = res1.status
        }

        //user albums names
        const res2 = await fetch("/api/albums",{
            method:"POST",
            headers:{
              "Authentication-Token":this.token,
              "Content-Type":"application/json"
            }
          })
          const data2 = await res2.json().catch((e)=>{})
            if (res2.ok) {
                this.allAlbumNames = data2
            } else {
                this.error = res2.status
            }
        
    },
    methods : {
        async deleteAlbum(name) {
            const res2 = await fetch(`/api/album/delete/${name}`,{
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
        },
        async creator(){
            const res2 = await fetch(`/change_role`,{
                headers:{
                  "Authentication-Token":this.token,
                  "Content-Type":"application/json"
                }
              })
            const data2 = await res2.json().catch((e)=>{})

            localStorage.removeItem('role')
            localStorage.removeItem('auth-token')
            localStorage.removeItem('user-id')
            localStorage.removeItem('username')
            this.$router.push('/')
            alert("You are now registered as a creator.")
        },
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
    }
    

}
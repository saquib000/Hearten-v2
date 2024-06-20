export default {
    template : 
    `<div>
        <h3>Create Playlist</h3>
        <form name="playlist-create" class='from-control'>
        <input type='text' placeholder='enter playlist name' class='from-control' v-model="playlist.playlist_name" required/>
            <div v-for='song in allSongs' >
                <input type="checkbox" :id="song.song_name" :value="song.song_id" v-model="playlist.checked_songs" />
                <label :for="song.song_name">{{song.song_name}}</label>
            </div>

            <button class="btn btn-primary" @click="playlistCreate"> Create </button>
        </form>
    </div>`,

    data() { return {
        id:localStorage.getItem('user-id'),
        token:localStorage.getItem('auth-token'),
        error:null,
        playlist: {
            checked_songs:[],
            playlist_name:null
        },
        allSongs:[],
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
    methods:{
        async playlistCreate() {
            // console.log(this.song)
            const res = await fetch('/api/playlist/create',{
              method:'POST',
              headers:{
                'Content-Type':'application/json',
                'Authentication-Token':this.token
              },
              body:JSON.stringify(this.playlist)
            })
            console.log(JSON.stringify(this.playlist))
            const data = await res.json()
            if (res.ok) {
              alert(data.msg)
              this.$router.push('/')
            } 
            
        }
    }
}
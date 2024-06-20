export default {
    template :
    `<div>
    <div id="album-create">
    <h3>Create Album</h3>
      <form name="album-create" class='from-control'>
        <input type='text' placeholder='enter album name' class='from-control' v-model="album.album_name" required/>
          <h4> Your songs:</h4>
          <div v-for='song in allSongs' >
          <div v-if="song.creator_id==id">
            <input type="checkbox" :id="song.song_name" :value="song.song_id" v-model="album.checked_songs" required/>
            <label :for="song.song_name">{{song.song_name}}</label>
          </div>
          </div>

          <button class="btn btn-primary" @click="albumCreate"> Create </button>
      </form>
    
  </div>
    </div>`,

    data() { return {
      id:localStorage.getItem('user-id'),
      token:localStorage.getItem('auth-token'),
      error:null,
      album: {
          checked_songs:[],
          album_name:null
      },
      allSongs:[],
      allAlbumNames:[]
      }
  },

  async beforeMount() {
      //all songs
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

      //all albums
      const res = await fetch("/api/albums",{
        headers:{
          "Authentication-Token":this.token,
          "Content-Type":"application/json"
        }
      })
      const data2 = await res.json().catch((e)=>{})
        if (res.ok) {
            this.allAlbumNames = data2
        } else {
            this.error = res.status
        }
  },
  methods:{
      async albumCreate() {
          // var names = 
          // if (this.allAlbumNames.includes(this.album.album_name)){
          //   return alert("album name already exist.")
          // }
          const res = await fetch('/api/album/create',{
            method:'POST',
            headers:{
              'Content-Type':'application/json',
              'Authentication-Token':this.token
            },
            body:JSON.stringify(this.album)
          })
          console.log(JSON.stringify(this.album))
          const data = await res.json()
          if (res.ok) {
            alert(data.msg)
            this.$router.push('/creator')
          } 
          
      }
  }
}
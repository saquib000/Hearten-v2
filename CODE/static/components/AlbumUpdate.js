export default {
    template :
    `<div>
    <div id="album-create">
    <h3>Update Album : {{album_name}} </h3>
      <form name="album-create" class='from-control'>
        <input type='text' placeholder='enter new album name' class='from-control' v-model="album.album_name_new" required/>
          <h4> Update songs:</h4>
          <div v-for='song in allSongs' >
          <div v-if="song.creator_id==id">
            <input type="checkbox" :id="song.song_name" :value="song.song_id" v-model="album.checked_songs" required/>
            <label :for="song.song_name">{{song.song_name}}</label>
          </div>
          </div>

          <button class="btn btn-primary" @click="albumUpdate"> Update album </button>
      </form>
    
  </div>
    </div>`,

    data() { return {
      id:localStorage.getItem('user-id'),
      token:localStorage.getItem('auth-token'),
      error:null,
      album_name: this.$route.params.album_name,
      album: {
          checked_songs:[],
          album_name_new:null,
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
      async albumUpdate() {
          // console.log(this.song)
          const res = await fetch(`/api/album/update/${this.$route.params.album_name}`,{
            method:'PUT',
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
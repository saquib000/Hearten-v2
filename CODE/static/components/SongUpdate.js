export default {
    template: `
    <div id="song-update">
        <h4> Update Your song : </h4>
        <div>
            <input type="text" name="song_name" :placeholder="this.songOld.song_name" class="form-control" required v-model='songNew.song_name'>
        </div>
        <br>
        <div>
            <input type="text" name="lyrics" :placeholder="this.songOld.lyrics" class="form-control" required maxlength="500" v-model='songNew.lyrics'>
            <br>
        </div>
        <div>
            <label for="date">Realease Date</label>
            <input type="date" id="date" name="date" value="Release date" required v-model='songNew.date'>
        </div>
        <div>
          <label for="music_file">Upload file: </label>
          <input type="file" name="music_file" accept=".mp3">
        </div>
        <br>
        <input class="btn btn-primary" type="submit" value="Update" @click=SongUpdate>
    </div>`,

  data() {
    return {
        songOld :{},
        songNew : {
            song_name : null,
            lyrics : null,
            date : null,
            file : null
        },
        token:localStorage.getItem('auth-token')
    }
  },
  async beforeMount() {
    const res = await fetch(`/api/song/${this.$route.params.id}`,{
        headers : {"Authentication-Token":this.token}
    })
    const data = await res.json()
    if (res.ok) {
        // console.log(data)
        this.songOld = data
    }
  },
  methods: {
    async SongUpdate() {
        // console.log(this.song)
        const res = await fetch(`/api/song/update/${this.$route.params.id}`,{
          method:'PUT',
          headers:{
            'Content-Type':'application/json',
            'Authentication-Token':this.token
          },
          body:JSON.stringify(this.songNew)
        })
        const data = await res.json()
        if (res.ok) {
          alert(data.message)
          this.$router.push('/allsongs')
        } 
        
    }
  },
}
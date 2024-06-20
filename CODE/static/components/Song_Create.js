export default {
    template: `
    <div id="song-create">
        <h4> Upload Your song : </h4>
        <div>
            <input type="text" name="song_name" placeholder="Title" class="form-control" v-model='song.song_name' required>
        </div>
        <br>
        <div>
            <input type="text" name="lyrics" placeholder="Lyrics" class="form-control" required maxlength="500" v-model='song.lyrics' >
            <br>
        </div>
        <div>
            <label for="date">Realease Date</label>
            <input type="date" id="date" name="date" value="Release date" required v-model='song.date'>
        </div>
        <div>
          <label for="music_file">Upload file: </label>
          <input type="file" name="music_file" accept=".mp3">
        </div>
        <br>
        <input class="btn btn-primary" type="submit" value="Upload" @click=SongCreate>
    </form>
  </div>`,
  data() {
    return {
        song : {
            song_name : null,
            lyrics : null,
            date : null,
            file : null
        },
        token:localStorage.getItem('auth-token')
    }
  },
  methods: {
    async SongCreate() {
          const res = await fetch('/api/song/create',{
          method:'POST',
          headers:{
            'Content-Type':'application/json',
            'Authentication-Token':this.token
          },
          body:JSON.stringify(this.song)
        })
        const data = await res.json()
        if (res.ok) {
          alert(data.message)
          this.$router.push('/allsongs')
        } 
        
    }
  },
}
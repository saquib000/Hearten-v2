export default {
    template : 
    `<div>

    <div>
        <h3>song:{{ this.song.song_name }} </h3>
            <div>Artist:{{ this.song.creator }} | Rating: {{this.rating}} | Release Date: {{this.song.date}} </div>
        <p>lyrics:{{ this.song.song_name }} </p>
    </div>

    
        <div  class="form-control">

          <div v-if='status=="Rated"'>
            <p>You have already rated this song. Your rating: {{ratingValue}}</p>
          </div>

          <div>
            <input type="radio" name="stars" value=1 class="form-check-input" v-model='stars'>
            <label for="1star"> 1 Star</label>
          </div>
          <div>
            <input type="radio" name="stars" value=2 class="form-check-input" v-model='stars'>
            <label for="2star"> 2 Star</label >
          </div>
          <div>
            <input type="radio" name="stars" value="3" class="form-check-input" v-model='stars'>
            <label for="3star"> 3 Star</label>
          </div>
          <div>
            <input type="radio" name="stars" value="4" class="form-check-input" v-model='stars'>
            <label for="4star"> 4 Star</label>
          </div>
          <div>
            <input type="radio" name="stars" value="5" class="form-check-input" v-model='stars'>
            <label for="5star"> 5 Star</label>
          </div>

          <button class="btn btn-primary"  value="Rate" @click="songRate()">Rate</button>

        </div>


    </div>`,
    data() {
        return {
            song : {},
            song_id:null,
            token : localStorage.getItem('auth-token'),
            stars : null,
            rating:null,
            ratingValue:null,
            status:null,
            username:localStorage.getItem('username')
        }
    },
    methods :{
        async songRate() {
            const bodyData = JSON.stringify({ "stars": this.stars });
            console.log(bodyData)

            const res3 = await fetch(`/api/song-rating/${this.song_id}`,{
              method:"POST",
              headers:{
                'Content-Type':'application/json',
                'Authentication-Token':this.token
              },
              body: bodyData
            })

            const data3 = await  res3.json()
            if (res3.ok) {
              alert(data3.msg)
              this.$router.go()
            } 
            
        }
    },
    async beforeMount() {
        //song data
        const res = await fetch(`/api/song/${this.$route.params.id}`,{
            headers : {"Authentication-Token":this.token}
        })
        const data = await res.json()
        if (res.ok) {
            this.song = data
            this.song_id = data['song_id']
        }

        //song rating
        const res2 = await fetch(`/api/song-rating/${this.$route.params.id}`,{
            headers : {"Authentication-Token":this.token}
        })
        const data2 = await res2.json()
        if (res2.ok) {
            this.rating = data2['rating']
            this.ratingValue = data2['ratingValue']
            this.status = data2['status']
        }




    }
}
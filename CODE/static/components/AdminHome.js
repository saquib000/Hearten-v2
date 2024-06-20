import Users from "./Users.js"
import FlagCenter from "./AdminFlagCenter.js"

export default {
    template : `
    <div>
    <h2>Welcome, admin</h2>
    <div id="stats">
    <h3>App stats </h3>
      <hr>
    <h4>Total Users : {{total_users}}</h4>
    <h4>Total Creators : {{total_creators}}</h4>
      <hr>
  </div>

  <div id="performance">
    <h3> App performance</h3>
    <table id="all-songs" class="table table-hover">
    <thead class="table-light">
    <tr>
      <th>Metric</th>
      <th>Stats</th>
    </tr>
    </thead>
    <tbody>
      <tr>
        <td>Total Songs</td>
        <td>{{total_songs}}</td>
      </tr>
      <tr>
        <td>Total Albums</td>
        <td>{{total_albums}}</td>
      </tr>
    </tbody>
    </table>
  </div>

  <div id="graphs">
    <h3>Key graphs</i></h3>
      <img src="/static/media/songs_graph.png">
  </div>

  <div id='flag center'>
    <h3>Flag center</h3>
    <FlagCenter />

  </div>
        
    </div>`,
    data(){
        return {
            token:localStorage.getItem('auth-token'),
            total_albums:null,
            total_creators:null,
            total_songs:null,
            total_users:null
        }
    },
    async beforeMount() {
        const resp = await fetch('/stats',{
            headers: {
                'Authentication-Token':this.token,
            },
        })
        const data = await resp.json().catch((e)=>{})
        if (resp.ok) {
            this.total_albums = data['total_albums']
            this.total_creators = data['total_creators']
            this.total_songs = data['total_songs']
            this.total_users = data['total_users']
        } else {
            this.error = resp.status
        }
    },
    components : {
        Users,
        FlagCenter
    }
}
export default {
    template :
    `<div>
    <h3> Profile </h3>
        <div class='from-control'>
            <h2>Username : @{{this.username}} </h2>
            <h2>Email : {{this.email}} </h2>
            <h2>Role : {{this.role}} </h2>
            <h2>Account status : 
                <h2 v-if="status"> Active</h2>
                <h2 v-else> Deactivated </h2>
            </h2>
        </div>
    </div>`,
    data(){
        return {
            data:null,
            error:null,
            id:localStorage.getItem('user-id'),
            username:localStorage.getItem('username'),
            role:localStorage.getItem('role'),
            status:localStorage.getItem('status'),
            email:localStorage.getItem('email')
        }
    },
    async beforeMount() {
        const res = await fetch(`/profile/${this.id}`,{
          headers:{
            "Authentication-Token":this.token,
            "Content-Type":"application/json"
          }
        })
        const data = await res.json().catch((e)=>{})
          if (res.ok) {
              this.data = data
          } else {
              this.error = res.status
          }
      }
}
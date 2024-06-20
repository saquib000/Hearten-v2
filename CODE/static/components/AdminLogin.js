export default {
    template:
    `<div>
    <div id="admin-login">
    <form class='form-control'
      <h3>Sign in to continue</h3>
      <label for="email">email</label>
      <input type="text" id="email" required v-model='cred.email'/>
      <br>
      <br>
      <label for="password">password</label>
      <input type="password" id="password" required v-model='cred.password'/>
      <br>
      <br>
      <button class="btn btn-primary" @click='login'> Login </button>
    

    <br>
    
        <div class='d-flex justify-content-center' v-if="error">
            <div class="alert alert-danger mt-2" role="alert">
                {{error}}
            </div>
        </div>

    </form>
    </div>

<div>
  <h5>Please go to User login if do not have Administrator access.</h5>
     <router-link to="/login" class="btn btn-primary">Go to user login</router-link>
</div>
    </div>
    `,
    data() {
        return {
            cred: {
                email: null,
                password:null
            },
            error : null
        }
    },
    methods : {
        async login() {
            const res = await fetch('/admin-login',{
                method: 'POST',
                headers: {'Content-Type':'application/json'},
                body: JSON.stringify(this.cred)
            })
            const data = await res.json()
            if (res.ok){ 
                //storing user info in localsotrage
                localStorage.setItem('auth-token',data.token)
                localStorage.setItem('user-id',data.id)
                localStorage.setItem('username',data.username)
                localStorage.setItem('role',data.role)
                this.$router.push({path: '/'})
            } else {
                this.error = data.msg
            }
        }
    }
}
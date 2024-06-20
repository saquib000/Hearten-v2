export default {
    template: `
    <div style='margin-top:28vh'>
        <div class='d-flex justify-content-center'>
            <div id="welcome_msg" style='margin-right:100px'>
                <h2 class="display-2" style='margin-top:50px'>Welcome to Hearten</h2>
                <hr>
                <h4 class="text-muted display-9"><i>listen to your heart</i></h4>
            </div>
            <div class=' bg-light p-5' >
                <h3>Sign in to continue</h3>
                <label for="u_name">email</label>
                <input type="text" class='form-control' id="u_name" name="u_name" v-model='cred.email' required/>
            
                <label for="password">password</label>
                <input type="password" class='form-control' id="u_pass" name="u_pass" v-model='cred.password' required />
                <br>
                
                <button class="btn btn-primary" @click='login()'>Login</button>

                <div class="alert alert-danger mt-2" role="alert" v-if="error">
                    {{error}}
                </div>
            </div>
        </div>
    </div>
    `,
    data() {
        return {
            cred: {
                // username: null,
                email: null,
                password:null
            },
            error : null
        }
    },
    methods : {
        async login() {
            const res = await fetch('/user-login',{
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
                localStorage.setItem('email',data.email)
                localStorage.setItem('status',data.active)
                this.$router.push({path: '/'})
            } else {
                this.error = data.msg
            }
        }
    }
}
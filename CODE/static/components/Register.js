export default {
    template: 
    `<div>
    <div id="register">
    <div class="form-control">
        <h4>Register</h4>
        <br>
        <label for="u_name">Email</label>
        <input type="text" id="u_name" name="u_name" required v-model='cred.email'/>
        <br>
        <br>
        <label for="u_name">Username</label>
        <input type="text" id="u_name" name="u_name" required v-model='cred.username'/>
        <br>
        <br>
        <label for="password">Password</label>
        <input type="password" id="u_pass" name="u_pass" required v-model='cred.password'/>
        <br>
        <br>
        <button class="btn btn-primary" @click='register()'> Register </button>
    </div>
    <br>
    </div>
    </div>`,
    data() {
        return {
            cred : 
                {email : null,
                username : null,
                password : null} 
        }
    },
    methods : {
        async register() {
            const res = await fetch('/register',{
                method:"POST",
                headers:{
                    'Content-Type':'application/json'
                },
                body:JSON.stringify(this.cred)
            })
            const data = await res.json()
            if (res.ok){
                this.$router.push('/')
            }

        }
    }
}
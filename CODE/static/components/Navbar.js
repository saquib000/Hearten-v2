// import SearchResult from "./SearchResult"

export default {
    template:
    `
    <div id="navbar">
        <nav class="navbar navbar-expand-lg bg-body-tertiary">
            <div class="container-fluid">
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
                </button>
                <router-link class="navbar-brand" to="/">Hearten</router-link>
            <div class="collapse navbar-collapse" id="navbarSupportedContent">
                <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                    <li class="nav-item" v-if="!is_login">
                        <router-link class="nav-link active" to="/register">Register</router-link>
                    </li>
                    <li class="nav-item">
                        <router-link to="/creator" class="nav-link">Creator Page</router-link>
                    </li>
                    <li class="nav-item">
                        <router-link to="/search" class="nav-link">Search</router-link>
                    </li>
                    <li class="nav-item" v-if="is_login"> 
                        <router-link to="/profile/" class="nav-link">Profile: {{this.username}}</router-link>
                    </li>
                    <li class="nav-item" v-if='is_login'>
                        <button class="nav-link" @click='logout()'>Logout</button>
                    </li>
                    <li class="nav-item" v-else>
                        <router-link to="/admin-login" class="nav-link active">
                        Admin login
                        </router-link>
                    </li>
                </ul>
    

    
            </div>
            </div>
        </nav>
    </div>
    `,
    // components:{SearchResult},
    data() {
        return {
            role : localStorage.getItem('role'),
            username : localStorage.getItem('username'),
            is_login : localStorage.getItem('auth-token'),
            id : localStorage.getItem('user-id')
        }
    },
    methods : {
        logout() {
            localStorage.removeItem('role')
            localStorage.removeItem('auth-token')
            localStorage.removeItem('user-id')
            localStorage.removeItem('username')
            this.$router.push('/login')
        },

    }
}

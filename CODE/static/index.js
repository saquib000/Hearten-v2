import router from "./router.js"
import Navbar from "./components/Navbar.js"

//NavGaurds 
// if not login send user to login first.
router.beforeEach((to,from,next) => {
    if (to.name != 'Login' && to.name != 'Register' && to.name != 'Admin-Login' && !localStorage.getItem('auth-token') ? true : false) {
        next({name:'Login'})
    } else next() 
})   

new Vue({
    'el':'#app',
    'template':
    `<div>

        <Navbar :key='has_changed'/>

        <div class="container text-center">
        <div class="row align-items-end">
            <div class="col"></div>
            <div class="col col-8">
                <router-view/>
            </div>
            <div class="col"></div>
        </div>
        </div>

    </div>`,
    router,
    components:{
        Navbar
    },
    data:{
        has_changed : true
    },
    watch : {
        $route(to,from) {
            this.has_changed = !this.has_changed
        }
    }
})
import AdminHome from './AdminHome.js'
import UserHome from './UserHome.js'

export default {
    template : `
    <div>
        <AdminHome v-if="userRole=='admin'"/>
        <UserHome v-else/>

    </div>
    `,
    data() {
        return {
            // userRole : this.$route.query.role
            userRole : localStorage.getItem('role')
        }
    },
    components: {
        AdminHome,
        UserHome
    }
}
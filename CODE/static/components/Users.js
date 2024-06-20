export default {
    template : `<div>
        <div v-if='error'>{{error}} #check navigation gaurds or something that protects the route</div>
        <div v-for="(user,index) in allUsers">{{index}} - {{user.email}} <button v-if='!user.active' @click=approve(user.id)>Approve</button></div>
    </div>`,

    data() { return {
        allUsers:[],
        token:localStorage.getItem('auth-token'),
        error:null
        }
    },
    methods : {
        async approve(Id) {
            const res = await fetch(`/activate/creator/${Id}`, {
                headers : {'Authentication-Token':this.token}
            })
            const data = await res.json()
            if (res.ok){
                alert(data.msg)
            }
        }
    },

    async mounted() {
        const resp = await fetch('/users',{
            headers: {
                'Authentication-Token':this.token,
            },
        })
        const data = await resp.json().catch((e)=>{})
        if (resp.ok) {
            this.allUsers = data
        } else {
            this.error = resp.status
        }
    }

}
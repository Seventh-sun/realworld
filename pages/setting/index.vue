<template>
    <div class="settings-page">
        <div class="container page">
            <div class="row">

                <div class="col-md-6 offset-md-3 col-xs-12">
                    <h1 class="text-xs-center">Your Settings</h1>

                    <ul class="error-messages">
                        <template v-for="(error, type) in errors">
                            <li v-for="item in error" :key="type + item">{{`${type} ${item}`}}</li>
                        </template>
                    </ul>

                    <form @submit.prevent="onSubmit()">
                        <fieldset>
                            <fieldset class="form-group">
                                <input v-model="userinfo.image" class="form-control" type="text" placeholder="URL of profile picture">
                            </fieldset>
                            <fieldset class="form-group">
                                <input v-model="userinfo.username" class="form-control form-control-lg" type="text" placeholder="Your Name" required>
                            </fieldset>
                            <fieldset class="form-group">
                                <textarea v-model="userinfo.bio" class="form-control form-control-lg" rows="8" placeholder="Short bio about you"></textarea>
                            </fieldset>
                            <fieldset class="form-group">
                                <input v-model="userinfo.email" class="form-control form-control-lg" type="email" placeholder="Email" required>
                            </fieldset>
                            <fieldset class="form-group">
                                <input v-model="userinfo.password" class="form-control form-control-lg" type="password" placeholder="Password">
                            </fieldset>
                            <button class="btn btn-lg btn-primary pull-xs-right">
                                Update Settings
                            </button>
                        </fieldset>
                    </form>

                    <hr>

                    <button @click="logout" class="btn btn-outline-danger">
                        Or click here to logout.
                    </button>
                </div>

            </div>
        </div>
    </div>
</template>

<script>
    import { updateUser } from '@/api/user'
    import { mapState } from 'vuex'
    const Cookie = process.client ? require('js-cookie') : undefined

    export default {
        name: 'SettingPage',
        middleware: 'auth',
        computed: {
            ...mapState([
                'user'
            ])
        },
        data () {
            return {
                userinfo: {},
                errors: {}
            }
        },
        methods: {
            async onSubmit () {
                try {
                    const data = await updateUser({ user: this.userinfo })

                    this.$store.commit('setUser', data.user)

                    Cookie.set('user', data.user)

                    this.$router.push({name: 'profile', params: { username: data.user.username }})
                } catch (e) {
                    console.error(e)
                    this.errors = e.errors
                }
            },
            logout() {
                this.$store.commit('setUser', null)
                Cookie.remove('user')
                this.$router.push('/')
            }
        },
        mounted () {
            this.userinfo = {
                email: this.user.email,
                username: this.user.username,
                image: this.user.image,
                bio: this.user.bio,
                password: ''
            }
        }
    }
</script>

<style>

</style>
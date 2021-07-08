<template>
    <div class="article-meta">
        <nuxt-link :to="{ name: 'profile', params: { username: data.author.username} }">
            <img :src="data.author.image || 'https://static.productionready.io/images/smiley-cyrus.jpg'" />
        </nuxt-link>
        <div class="info">
            <nuxt-link :to="{ name: 'profile', params: { username: data.author.username} }" class="author">{{ data.author.username }}</nuxt-link>
            <span class="date">{{ data.author.createdAt | date('MMM DD,YYYY')}}</span>
        </div>
        <template v-if='isSelf'>
            <nuxt-link class="btn btn-outline-secondary btn-sm" :to="{name: 'editor', params: { slug: $route.params.slug }}">
                <i class="ion-edit"></i> Edit Article
            </nuxt-link>
            <button class="btn btn-outline-danger btn-sm" @click="deleteArticle()">
                <i class="ion-trash-a"></i> Delete Article
            </button>
        </template>
        <template v-else>
            <button @click="toggleFollow()" class="btn btn-sm" :class="data.author.following ? 'btn-secondary' : 'btn-outline-secondary'" :disabled="followLock">
                <i class="ion-plus-round"></i>
                &nbsp;
                {{ data.author.following ? 'Unfollow' : 'Follow' }} {{ data.author.username }}
            </button>
            &nbsp;&nbsp;
            <button @click="toggleFavorite()" class="btn btn-sm" :class="data.favorited ? 'btn-primary' : 'btn-outline-primary'" :disabled="favoriteLock">
                <i class="ion-heart"></i>
                &nbsp;
                {{ data.favorited ? 'Unfavorite' : 'Favorite'}} Article <span class="counter">({{ data.favoritesCount }})</span>
            </button>
        </template>
    </div>
</template>

<script>
    import { mapState } from 'vuex'
    import { deleteArticle, favoriteArticle, unfavoriteArticle } from '@/api/article'
    import { followUser, unfollowUser } from '@/api/user'
    
    export default {
        name: 'ArticleMeta',
        props: {
            data: {
                type: Object
            }
        },
        computed: {
            ...mapState(['user']),
            isSelf () {
                return this.data.author.username === this.user.username
            }
        },
        data () {
            return {
                favoriteLock: false,
                followLock: false,
            }
        },
        methods: {
            async toggleFavorite () {
                this.favoriteLock = true
                try {
                    this.data.favorited ? await unfavoriteArticle({ slug: this.$route.params.slug }) : await favoriteArticle({ slug: this.$route.params.slug })
                    this.$emit('refresh')
                } catch (e) {
                    console.error(e)
                }
                this.favoriteLock = false
            },
            async toggleFollow () {
                this.followLock = true
                try {
                    const { following, username } = this.data.author
                    following ? await unfollowUser({ username }) : await followUser({ username })
                    this.$emit('refresh')
                } catch (e) {
                    console.error(e)
                }
                this.followLock = false
            },
            async deleteArticle () {
                try {
                    await deleteArticle({ slug: this.$route.params.slug })
                    this.$router.push("/")
                } catch (e) {
                    console.error(e)
                }
            }
        }
    }
</script>

<style>

</style>
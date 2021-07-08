<template>
    <div class="profile-page">
        <div class="user-info">
            <div class="container">
            <div class="row">

                <div class="col-xs-12 col-md-10 offset-md-1">
                    <img :src="profile.image" class="user-img" />
                    <h4>{{profile.username}}</h4>
                    <p>
                        {{profile.bio}}
                    </p>
   
                    <nuxt-link v-if="isSelf" to="/setting" class="btn btn-sm btn-outline-secondary action-btn">
                        <i class="ion-gear-a"></i>
                        &nbsp;
                        Edit Profile Settings
                    </nuxt-link>
                    <button v-else class="btn btn-sm btn-outline-secondary action-btn">
                        <i class="ion-plus-round"></i>
                        &nbsp;
                        {{profile.following ? 'Unfollow' : 'Follow'}} {{profile.username}}
                    </button>
                </div>

            </div>
            </div>
        </div>

        <div class="container">
            <div class="row">

            <div class="col-xs-12 col-md-10 offset-md-1">
                <div class="articles-toggle">
                <ul class="nav nav-pills outline-active">
                    <li class="nav-item">
                        <nuxt-link class="nav-link" :to="{name: 'profile', params: { username }}" exact>My Articles</nuxt-link>
                    </li>
                    <li class="nav-item">
                        <nuxt-link class="nav-link" :to="{name: 'profile', params: { username }, query: { tab: 'favorited'}}">Favorited Articles</nuxt-link>
                    </li>
                </ul>
                </div>

                <div v-for="(article, index) in articles" :key="article.slug" class="article-preview">
                    <div class="article-meta">
                        <nuxt-link :to="{name: 'profile', params: { username: article.author.username }}">
                            <img :src="article.author.image || 'https://static.productionready.io/images/smiley-cyrus.jpg'" />
                        </nuxt-link>
                        <div class="info">
                            <nuxt-link :to="{ name: 'profile', params: { username: article.author.username }}" class="author">{{ article.author.username }}</nuxt-link>
                            <span class="date">{{ article.createdAt | date('MMM DD,YYYY') }}</span>
                        </div>

                        <button @click="toggleFavorite(article, index)" class="btn btn-sm pull-xs-right" :class="article.favorited ? 'btn-primary' : 'btn-outline-primary'" :disabled="article.lock">
                            <i class="ion-heart"></i> {{ article.favoritesCount }}
                        </button>
                    </div>
                    <nuxt-link :to="{name: 'article', params: { slug: article.slug}}" class="preview-link">
                        <h1>{{ article.title }}</h1>
                        <div v-html="article.body"></div>
                        <span>Read more...</span>
                    </nuxt-link>
                </div>

            </div>

            </div>
        </div>
    </div>
</template>

<script>
    import { getProfile } from '@/api/user'
    import { getArticles, favoriteArticle, unfavoriteArticle, getArticleData } from '@/api/article'
    import { mapState } from 'vuex'
    import MarkdownIt from 'markdown-it'

    export default {
        name: 'ProfilePage',
        middleware: 'auth',
        watchQuery: ['tab'],
        computed: {
            ...mapState(['user', '']),
            isSelf () {
                return this.profile.username === this.user.username
            },
            username () {
                return this.$route.params.username
            }
        },
        data () {
            return {
                favoriteLock: false
            }
        },
        async asyncData ({ route }) {
            const { username } = route.params
            const { tab } = route.query
            const articleQuery = tab ? { favorited: username } : { author: username }
            const [proRes, artRes ] = await Promise.all([
                getProfile({ username: encodeURI(username) }),
                getArticles(articleQuery)
            ])

            artRes.articles && artRes.articles.forEach(art => {
                art.lock = false
                const md = new MarkdownIt()
                art.body = md.render(art.body)
                const res = art.body.match(/<\/.+>/)
                const tag = res[0]
                const index = res.index
                art.body = art.body.substring(0, index + tag.length)
            })
            return {
                profile: proRes.profile,
                ...artRes
            }
        },
        methods: {
            async toggleFavorite ({ favorited, slug }, i) {
                this.articles[i].lock = true
                try {
                    favorited ? await unfavoriteArticle({ slug }) : await favoriteArticle({ slug })
                    const data = await getArticleData({ slug })
                    const md = new MarkdownIt()
                    data.article.body = md.render(data.article.body)
                    const res = data.article.body.match(/<\/.+>/)
                    const tag = res[0]
                    const index = res.i
                    data.article.body = data.article.body.substring(0, index + tag.length)
                    data.article.lock = false
                    this.articles.splice(i, 1, data.article)
                } catch (e) {
                    console.error(e)
                }
            },
        }
    }
</script>

<style>

</style>
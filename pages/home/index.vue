<template>
    <div class="home-page">
        <div class="banner">
            <div class="container">
                <h1 class="logo-font">conduit</h1>
                <p>A place to share your knowledge..</p>
            </div>
        </div>

        <div class="container page">
            <div class="row">
                <div class="col-md-9">
                    <div class="feed-toggle">
                        <ul class="nav nav-pills outline-active">
                            <li v-if="user" class="nav-item">
                                <nuxt-link class="nav-link " :to="{name: 'home', query: { tab: 'feed' }}" exact>Your Feed</nuxt-link>
                            </li>
                            <li class="nav-item">
                                <nuxt-link class="nav-link " to="/" exact>Global Feed</nuxt-link>
                            </li>
                            <li v-if="tag" class="nav-item">
                                <nuxt-link class="nav-link active" to="">
                                    <i class="ion-pound"></i>
                                    {{ tag }}
                                </nuxt-link>
                            </li>
                        </ul>
                    </div>
                    <div v-for="(article, index) in articles" :key="article.slug" class="article-preview">
                        <div class="article-meta">
                            <nuxt-link :to="{ name: 'profile', params: { username: article.author.username }}"
                                ><img :src="article.author.image || 'https://static.productionready.io/images/smiley-cyrus.jpg'"
                            /></nuxt-link>
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

                <div class="col-md-3">
                    <div class="sidebar">
                        <p>Popular Tags</p>

                        <div class="tag-list">
                            <nuxt-link v-for="(tag, index) in tags" :key="index" :to="{name: 'home', query: { tag, tab: $route.query.tab }}" class="tag-pill tag-default">{{ tag }}</nuxt-link>
                        </div>
                    </div>
                </div>

                <nav>
                    <ul class="pagination">
                        <li v-for="(page, index) in pageCount" :key="index" class="page-item" :class="{'active': page == pageCurrent }">
                            <nuxt-link class="page-link" :to="{name: 'home', query: {
                                page,
                                tag: $route.query.tag,
                                tab: $route.query.tab
                            }}">{{page}}</nuxt-link>
                        </li>
                    </ul>
                </nav>
            </div>
        </div>
    </div>
</template>

<script>
    import { getArticles, getFeedArticles, getTags, favoriteArticle, unfavoriteArticle, getArticleData } from "@/api/article"
    import MarkdownIt from 'markdown-it'
    import { mapState } from 'vuex'

    export default {
        name: "HomePage",
        computed: {
            ...mapState([
                'user'
            ]),
            tag () {
                return this.$route.query.tag
            },
        },
        watchQuery: ['page', 'tab', 'tag', ''],
        async asyncData ({ route }) {
            const query = route.query
            const limit = 20
            if(query && query.page){
                query.offset = query.page ? ( query.page - 1 ) * limit : 0
            }
            // const [ artRes, tagRes ] = await Promise.all([
            //     query.tab == 'feed' ? getFeedArticles(query) : getArticles(query),
            //     getTags()
            // ])
            console.log(query)
            const artRes =  query.tab == 'feed' ? await getFeedArticles(query) : await getArticles(query)
            console.log(artRes)
            const tagRes = await getTags()
            console.log(tagRes)
            artRes.articles && artRes.articles.forEach(art => {
                art.lock = false
                const md = new MarkdownIt()
                art.body = md.render(art.body)
                const res = art.body.match(/<\/.+>/)
                const tag = res[0]
                const index = res.index
                art.body = art.body.substring(0, index + tag.length)
            })
            const pageCount = Math.ceil(artRes.articlesCount / limit)
            return {
                ...artRes,
                ...tagRes,
                pageCurrent: query.page,
                pageCount
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
                    this.articles[i].lock = false
                }
            },
        }
    };
</script>

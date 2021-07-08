<template>
    <div class="article-page">

        <div class="banner">
            <div class="container">

            <h1>{{ article.title }}</h1>

            <article-meta :data="article" @refresh="refresh()"></article-meta>

            </div>
        </div>

        <div class="container page">

            <div class="row article-content">
                <div class="col-md-12" v-html="article.body"></div>
            </div>

            <hr />

            <div class="article-actions">
                <article-meta :data="article"></article-meta>
            </div>

            <div class="row">

                <div class="col-xs-12 col-md-8 offset-md-2">

                    <form class="card comment-form" @submit.prevent="onSubmit()">
                        <div class="card-block">
                            <textarea v-model="comment" class="form-control" placeholder="Write a comment..." rows="3" :disabled="lock"></textarea>
                        </div>
                        <div class="card-footer">
                            <img :src="user.image || 'https://static.productionready.io/images/smiley-cyrus.jpg'" class="comment-author-img" />
                            <button class="btn btn-sm btn-primary" :disabled="lock">
                                Post Comment
                            </button>
                        </div>
                    </form>
                    
                    <div v-for="comment in comments" :key="comment.id" class="card">
                        <div class="card-block">
                            <p class="card-text">{{ comment.body }}</p>
                        </div>
                        <div class="card-footer">
                            <nuxt-link :to="{ name: 'profile', params: { username: comment.author.username }}"  class="comment-author">
                                <img :src="comment.author.image || 'https://static.productionready.io/images/smiley-cyrus.jpg'"  class="comment-author-img" />
                            </nuxt-link>
                            &nbsp;
                            <nuxt-link :to="{ name: 'profile', params: { username: comment.author.username }}" class="comment-author">{{ comment.author.username }}</nuxt-link>
                            <span class="date-posted">{{ comment.createdAt | date('MMM DD,YYYY') }}</span>

                            <span class="mod-options">
                                <!-- <i class="ion-edit"></i> -->
                                <i v-if="comment.author.username == user.username" @click="deleteComment(comment.id)" class="ion-trash-a"></i>
                            </span>
                        </div>
                    </div>

                </div>

            </div>

        </div>

    </div>
</template>

<script>
    import { getArticleData, addComments, getComments, deleteComments } from '@/api/article'
    import ArticleMeta from '@/components/ArticleMeta.vue'
    import MarkdownIt from 'markdown-it'
    import { mapState } from 'vuex'

    export default {
        name: 'ArticlePage',
        middleware: 'auth',
        components: { ArticleMeta },
        computed: {
            ...mapState([
                'user'
            ]),
            slug () {
                return this.$route.params.slug
            }
        },
        data () {
            return {
                comment: '',
                lock: false
            }
        },
        async asyncData ({ route }) {
            const { slug } = route.params
            const [ artRes, comRes ] = await Promise.all([
                getArticleData({ slug }),
                getComments({ slug })
            ])
            const md = new MarkdownIt()
            artRes.article.body = md.render(artRes.article.body)
            return {
                article: artRes.article,
                comments: comRes.comments
            }
        },
        methods: {
            async refresh () {
                const data = await getArticleData({ slug: this.slug })
                const md = new MarkdownIt()
                data.article.body = md.render(data.article.body)
                this.article =  data.article
            },
            async refreshComments () {
                const data = await getComments({ slug: this.slug })
                this.comments = data.comments
            },
            async onSubmit(){
                this.lock = true
                try {
                    await addComments({ slug: this.slug, comment: { body: this.comment } })
                    await this.refreshComments()
                } catch (e) {
                    console.error(e)
                }
                this.lock = false
            },
            async deleteComment(id){
                await deleteComments({ id, slug: this.slug })
                await this.refreshComments()
            }
        }
    }
</script>

<style>

</style>
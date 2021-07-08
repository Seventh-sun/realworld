<template>
    <div class="editor-page">
        <div class="container page">
            <div class="row">
                <div class="col-md-10 offset-md-1 col-xs-12">
                    <ul class="error-messages">
                        <template v-for="(error, type) in errors">
                            <li v-for="item in error" :key="type + item">{{`${type} ${item}`}}</li>
                        </template>
                    </ul>
                    <form>
                        <fieldset>
                            <fieldset class="form-group">
                                <input v-model="article.title" type="text" class="form-control form-control-lg" placeholder="Article Title" :disabled="lock">
                            </fieldset>
                            <fieldset class="form-group">
                                <input v-model="article.description" type="text" class="form-control" placeholder="What's this article about?" :disabled="lock">
                            </fieldset>
                            <fieldset class="form-group">
                                <textarea v-model="article.body" class="form-control" rows="8" placeholder="Write your article (in markdown)" :disabled="lock"></textarea>
                            </fieldset>
                            <fieldset class="form-group">
                                <input v-model="article.tagList" type="text" class="form-control" placeholder="Enter tags" :disabled="lock"><div class="tag-list"></div>
                            </fieldset>
                            <button @click="onSubmit()" class="btn btn-lg pull-xs-right btn-primary" type="button" :disabled="lock">
                                Publish Article
                            </button>
                        </fieldset>
                    </form>
                </div>

            </div>
        </div>
    </div>
</template>

<script>
    import { createArticle, getArticleData, updateArticle } from '@/api/article'

    export default {
        name: 'EditorPage',
        middleware: 'auth',
        props: {
            slug: {
                type: String
            }
        },
        data () {
            return {
                article: {
                    title: '',
                    description: '',
                    body: '',
                    tagList: ''
                },
                errors: {},
                lock: false,
            }
        },
        methods: {
            async onSubmit() {
                this.lock = true
                try {
                    const { article } = this.article.slug ? await updateArticle({ article: this.article }) : await createArticle({ article: this.article })
                    // console.log(data)
                    this.$router.push({ name: 'article', params: { slug: article.slug } })
                } catch (e) {
                    this.errors = e.errors
                    this.lock = false
                }
            }
        },
        async mounted () {
            if(this.slug){
                const data = await getArticleData({ slug: this.slug})
                this.article = {
                    slug: this.slug,
                    title: data.article.title,
                    description: data.article.description,
                    body: data.article.body,
                    tagList: ''
                }
            }
        }
    }
</script>

<style>

</style>
import { request } from '@/plugins/request.js' 

export const getArticles = params => {
    return request({
        url: '/api/articles',
        method: 'get',
        params
    })
}

export const getFeedArticles = params => {
    return request({
        url: '/api/articles/feed',
        method: 'get',
        params
    })
}

export const getTags = params => {
    console.log(request)
    return request({
        url: '/api/tags',
        method: 'get',
        params
    })
}

export const createArticle = data => {
    return request({
        url: '/api/articles',
        method: 'post',
        data
    })
}

export const getArticleData = ({ slug }) => {
    return request({
        url: `/api/articles/${slug}`,
        method: 'get'
    })
}

export const updateArticle = data => {
    return request({
        url: `/api/articles/${data.article.slug}`,
        method: 'put',
        data
    })
}

export const deleteArticle = ({ slug }) => {
    return request({
        url: `/api/articles/${slug}`,
        method: 'delete'
    })
}

export const favoriteArticle = ({ slug }) => {
    return request({
        url: `/api/articles/${slug}/favorite`,
        method: 'post'
    })
}

export const unfavoriteArticle = ({ slug }) => {
    return request({
        url: `/api/articles/${slug}/favorite`,
        method: 'delete'
    })
}

export const addComments = data => {
    return request({
        url: `/api/articles/${data.slug}/comments`,
        method: 'post',
        data
    })
}

export const getComments = ({ slug }) => {
    return request({
        url: `/api/articles/${slug}/comments`,
        method: 'get'
    })
}

export const deleteComments = ({ slug, id }) => {
    return request({
        url: `/api/articles/${slug}/comments/${id}`,
        method: 'delete'
    })
}
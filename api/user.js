import { request } from '@/plugins/request.js' 

export const login = data => {
    return request({
        url: '/api/users/login',
        method: 'post',
        data
    })
}

export const register = data => {
    return request({
        url: '/api/users',
        method: 'post',
        data
    })
}

export const getProfile = ({ username }) => {
    return request({
        url: `/api/profiles/${username}`,
        method: 'get'
    })
}

export const updateUser = data => {
    return request({
        url: `/api/user`,
        method: 'put',
        data
    })
}

export const followUser = ({ username }) => {
    return request({
        url: `/api/profiles/${username}/follow`,
        method: 'post'
    })
}

export const unfollowUser = ({ username }) => {
    return request({
        url: `/api/profiles/${username}/follow`,
        method: 'delete'
    })
}
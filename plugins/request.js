import axios from 'axios'

export const request = axios.create({
    baseURL: 'https://conduit.productionready.io'
})

export default ({store}) => {
    request.interceptors.request.use(function (config) {  
        const { user } = store.state
        if(user && user.token){
            config.headers.Authorization = `Token ${user.token}`
        }
        return config
    }, function (error) {
        return Promise.reject(error)
    })

    request.interceptors.response.use(
        response => {
            return response.data 
        },
        //接口错误状态处理，也就是说无响应时的处理
        error => {
            // console.log(error)
            return Promise.reject(error.response.data) // 返回接口返回的错误信息
        }
    )
}
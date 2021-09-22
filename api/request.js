import Request from 'luch-request'
// import store from '@/store/index'

const BASE_URL = ''
// const BASE_URL = '/ckapi'

const http = new Request()

/**
  * @description 修改实例默认配置
  * @param {Function}
*/
http.setConfig(config => {
  config.baseURL = BASE_URL + '/api'
  config.timeout = 30000
  // config.withCredentials = true   // 跨域请求携带 cookies，仅支持h5
  config.header = {
    'Content-Type': 'application/json'
  }
  return config
})

/**
  * @description 请求拦截器
  * @param {Function}   
*/
const interceptorsRequest = (config) => {
  const token = uni.getStorageSync('token')
  if (token) {
    config.header = {
      ...config.header,
      Authorization: token
    }
  }
  return config
}
http.interceptors.request.use(interceptorsRequest, err => {
  return Promise.reject(err)
})

/**
  * @description 响应拦截器
  * @param {Function}   
*/
const interceptorsResponse = (response) => {
  const code = response.statusCode
  const res = response.data
  switch (true) {
  	case code >= 200 && code < 300:
  		return Promise.resolve(res)
  	case res.msg:
  		uni.showToast({
  		  title: `${res.msg}`,
  		  icon: 'none'
  		})
  		return Promise.reject(null)
  	case code === 401:
  		uni.navigateTo({
  			url: '../login/login'
  		})
  		uni.showToast({
  		  title:'请先登录',
  		  icon: 'none'
  		})
  		return Promise.reject(null)
  	default:
  		return Promise.resolve(res)
  }
}
const interceptorsResponseErr = (error) => {
  console.log('响应拦截')
  console.dir(error)	
  if (error.errMsg.includes('timeout')) {
  	uni.showToast({
  	  title:'请求超时，请重试',
  	  icon: 'none'
  	})
  	return Promise.reject(null)
  }
  if (error.statusCode) {
  	const code = error.statusCode
  	const res = error.data
  	switch (true) {
  		case code === 401:
  			uni.navigateTo({
  				url: '../login/login'
  			})
  			uni.showToast({
  			  title:'请先登录',
  			  icon: 'none'
  			})
  			return Promise.reject(res)
  		default:
  			if (res.msg) {
  				uni.showToast({
  				  title: `${res.msg}`,
  				  icon: 'none'
  				})
  			} else {
  				uni.showToast({
  				  title: `请求出错【${res}】`,
  				  icon: 'none'
  				})
  			}
  			return Promise.reject(res)
  	}
  } else {
  	uni.showToast({
  	  title: '请求无响应',
  	  icon: 'none'
  	})
  	return Promise.reject(null)
  }
}
http.interceptors.response.use(interceptorsResponse, interceptorsResponseErr)

export { http }
import { http } from './request.js'

class Api {
  // 登录
  Sign(data) {
    return http.post('/Sign', data)
  }

  getUserValue(data) {
    return http.get('/userValue', {data})
  }
}

export default new Api()
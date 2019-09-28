import axios from 'axios'
import Cookies from 'js-cookie'
import router from '../router'
import config from '@/config'
import {constant} from '@/constant/constant'

let apiRoot = ''
if (process.env.NODE_ENV === 'development') {
  apiRoot = config.development.apiRoot
} else if (process.env.NODE_ENV === 'production') {
  apiRoot = config.production.apiRoot
}

axios.defaults.timeout = 15000
axios.defaults.baseURL = apiRoot

// http request 请求拦截器
axios.interceptors.request.use(
  config => {
    const token = Cookies.get('token')
    if (token) {
      config.headers.Authorization = 'Bearer ' + token
    }
    // config.headers = {
    //   'Content-Type': 'application/json;charset=UTF-8'
    // }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// http response 响应拦截器
axios.interceptors.response.use(
  response => {
    if (response.data.retCode === 30006) {
      router.push({
        path: '/',
        querry: {redirect: router.currentRoute.fullPath} // 从哪个页面跳转
      })
    }
    return response
  },
  error => {
    return Promise.reject(error)
  }
)

/**
 * 封装get方法
 * @param url
 * @param data
 * @returns {Promise}
 */

export function get(url, params = {}) {
  return new Promise((resolve, reject) => {
    axios.get(url, {
      params: params
    })
      .then(response => {
        resolve(response.data)
      })
      .catch(err => {
        reject(err)
      })
  })
}

export function getAllSession(seccsionUrl, params = {}) {
  return new Promise((resolve, reject) => {
    axios.get(seccsionUrl, {
      params: params
    })
      .then(response => {
        resolve(response.data)
      })
      .catch(err => {
        reject(err)
      })
  })
}


/**
 * 封装post请求
 * @param url
 * @param data
 * @returns {Promise}
 */

export function post(url, data = {}) {
  let count = 0
  if (constant.flag == false && count == 0) {
    setTimeout(function () {
      constant.flag = true
      count = 1
    }, 150000);
  }
  if (constant.flag) {
    getAllSession("index/Index/is_session").then((response) => {
      constant.flag = false
      if (response < 1) {
        router.push({
          path: '/',
          querry: {redirect: router.currentRoute.fullPath} // 从哪个页面跳转
        })
        constant.sessionFlag = 1
        return
      }
    })
  }

  return new Promise((resolve, reject) => {
    axios.post(url, data)
      .then(
        response => {
          resolve(response.data)
        }, err => {
          reject(err)
        })
  })
}


/**
 * 封装post请求Login
 * @param url
 * @param data
 * @returns {Promise}
 */

export function postLogin(url, data = {}) {
  return new Promise((resolve, reject) => {
    axios.post(url, data)
      .then(response => {
        resolve(response.data)
      }, err => {
        reject(err)
      })
  })
}


export function setAxiosbaseURL(url) {
  axios.defaults.baseURL = url
}

export function getAxiosbaseURL() {
  return axios.defaults.baseURL
}

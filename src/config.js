import packageInfo from '../package.json'
let res = window.location.href
let H = res.split("//")[1]
let config = H.split("/")[0]
if(config == 'localhost:8080'){
  config = "supply.lejzl.com"
}
export default {
  version: packageInfo.version,

  development: {
    apiRoot:  "http://"+config
  },
  production: {
    apiRoot:  "http://"+config
  }
}

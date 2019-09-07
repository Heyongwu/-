let res = window.location.href
let H = res.split("//")[1]
let config = H.split("/")[0]
if(config == 'localhost:8080'){
  config = "supply.lejzl.com"
}
export const baseURL = {
  releaseIP:  "http://"+config
};

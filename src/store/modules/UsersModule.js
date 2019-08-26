import axios from "axios";
import iView from "iview";
import Cookies from 'js-cookie'
import { post } from '../../utils/http'


export default {
  namespaced: true,
  state: {
    currentUser: {
      get UserName() {
        return localStorage.getItem("currentUser_name");
      },
      get UserToken() {
        return localStorage.getItem("currentUser_token");
      },
      get RefreshToken() {
        return localStorage.getItem("currentUser_refresh_token");
      }
    }
  },
  mutations: {
    setUser(state, { user_name, user_token, refresh_token }) {
      // 在这里把手机号和token保存起来
      localStorage.setItem("currentUser_name", user_name);
      localStorage.setItem("currentUser_token", user_token);
      localStorage.setItem("currentUser_refresh_token", refresh_token);
    },
    clearUser(state) {
      localStorage.clear();
    }
  },
  actions: {
    userLogin(context, { user_name, user_password, router}) {
      const params = {
        user_sn: user_name,
        password: user_password
      }
      post('/index/Index/login', params)
        .then((response) => {
          alert(JSON.stringify(response))
          if (response === -1|| response ===  0 || response.toString().length === 2) {
            /*iView.Message.error('手机号或密码错误！');*/
            context.commit("setSignTrue", null, { root: true });
          } else{
            context.commit("setSignFalse", null, { root: true });
            Cookies.set('token', response.token)
            Cookies.set('user_id', response.user_id)
            Cookies.set('uCode', response.user_sn)
            Cookies.set('uName', response.user_name)
            Cookies.set('user_type', response.user_type)
            Cookies.set('company_id', response.company_id)
            Cookies.set('company_sn', response.company_sn)
            Cookies.set('company_name', response.company_name)
            router.push("/home")
          }
        }, err => {
        alert(JSON.stringify(err))
          /*iView.Message.error('手机号或密码错误！');*/
          context.commit("setSignTrue", null, { root: true });
        })
    },
    loginOUt(context, { router }) {
      router.push({ path: "/" });
      location.reload();
      context.commit("clearUser");
    }
  }
};

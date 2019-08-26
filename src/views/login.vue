<template>
  <div class="note full-screen" :style ="note">
    <br>
    <br>
    <br>
    <br>
    <Row>
      <i-col span="8">&nbsp;</i-col>
      <i-col class="title" span="8">
        <img style="width: 200px;height: 100px;" src="../static/images/logo1.png"  />
      </i-col>
      <i-col span="8">&nbsp;</i-col>
    </Row>
    <br>
    <Row>
      <i-col span="8">&nbsp;</i-col>
      <i-col class="title" span="8">
        <h1>供应商系统</h1>
      </i-col>
      <i-col span="8">&nbsp;</i-col>
    </Row>
    <br>
    <br>
    <br>
    <Row>
      <i-col span="9">&nbsp;</i-col>
      <i-col span="6">
        <div class="login-con">
          <Card icon="log-in" title="欢迎登录" :bordered="false" style="background:#eee">
            <div class="form-con">
              <i-form ref="loginForm" :model="form" :rules="rules" :loading="true">
                <form-item prop="phone">
                  <i-input v-model="form.phone" placeholder="请输入手机号" @on-enter="handleSubmit">
                <span slot="prepend">
                  <Icon :size="16" type="ios-person"></Icon>
                </span>
                  </i-input>
                </form-item>
                <form-item prop="password">
                  <i-input type="password" v-model="form.password" placeholder="请输入密码" @on-enter="handleSubmit">
                <span slot="prepend">
                  <Icon :size="14" type="md-lock"></Icon>
                </span>
                  </i-input>
                </form-item>
                <div class="name-password-error" v-if="$store.state.ifSign">手机号或密码错误</div>
                <div class="name-password-error" v-else></div>
                <form-item>
                  <i-button @click="handleSubmit" type="primary" long>登录</i-button>
                </form-item>
              </i-form>
            </div>
          </Card>
        </div>
      </i-col>
      <i-col span="9">&nbsp;</i-col>
    </Row>
  </div>
</template>

<script>
import logo from '../static/images/logo1.png'
import Cookies from 'js-cookie'
import { post } from '../utils/http'

export default {
  data () {
    return {
      note: {
        logo,
        backgroundImage: 'url(' + require('../static/bg.jpg') + ')',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center center',
        backgroundSize: 'cover',
        backgroundAttachment: 'fixed'
      },
      form: {
        phone: '',
        password: ''
      },
      retMsg: '',
      rules: {
        phone: [
          { required: true, message: "请输入手机号。", trigger: "blur" }
        ],
        password: [
          { required: true, message: "请输入密码。", trigger: "blur" }
        ]
      }
    }
  },

  methods: {
    handleSubmit () {
      this.$refs['loginForm'].validate((valid) => {
        if (valid) {
          this.login()
        }
      })
    },
    login: function () {
      // this.$store.dispatch("users/userLogin", {
      //   user_name: this.form.phone,
      //   user_password: this.form.password,
      //   router: this.$router
      // });
      const params = {
        phone: this.form.phone,
        password: this.form.password
      }

      post('/index/Index/login', params)
        .then((response) => {
          if (response === -1 || response === 0 || response.toString().length === 2) {
            this.$Notice.error({
              title: '手机号密码有误',
              desc: response.retMsg
            });
          } else{
            Cookies.set('token', response.token)
            Cookies.set('user_id', response.user_id)
            Cookies.set('uCode', response.phone)
            Cookies.set('uName', response.user_name)
            Cookies.set('user_type', response.user_type)
            Cookies.set('company_id', response.company_id)
            Cookies.set('company_sn', response.company_sn)
            Cookies.set('company_name', response.company_name)
            Cookies.set('user_mobile', response.user_mobile)
            Cookies.set('company_type', response.company_type)
            this.$router.push('/home')
          }
        }, err => {
          this.$Notice.error({
            title: '服务器错误',
            desc: err
          });
        })
    },

  }
}
</script>

<style scoped>
  .name-password-error {
    padding-bottom: 2px;
    text-align: left;
    line-height: 1;
    color: #ed3f14;
  }
  .full-screen {
    position: fixed;
    height: 100%;
    width: 100%;
    top: 0;
    left: 0;
    z-index: -1;
    margin: 0;
    border-radius: 0;
  }
  .title {
    text-align: center;
    color: black;
    font-size: 18px;
  }
</style>

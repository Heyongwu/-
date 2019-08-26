<template>
  <div class="note full-screen" :style ="note">
    <br>
    <br>
    <br>
    <br>
    <Row>
      <i-col span="6">&nbsp;</i-col>
      <i-col class="title" span="8">
        <img style="width: 200px;height: 100px;" src="../../static/images/logo1.png"  />
      </i-col>
      <i-col span="4">&nbsp;</i-col>
    </Row>
    <br>
    <Row>
      <i-col span="2">&nbsp;</i-col>
      <i-col class="title" span="20">
        <h1>供应商系统</h1>
      </i-col>
      <i-col span="2">&nbsp;</i-col>
    </Row>
    <br>
    <br>
    <br>
    <Row>
      <i-col span="2">&nbsp;</i-col>
      <i-col span="20">
        <div class="login-con">
          <Card icon="log-in" title="欢迎登录" :bordered="false" style="background:#eee">
            <div class="form-con">
              <i-form ref="loginForm" :model="form" :rules="rules" :loading="true">
                <form-item prop="userID">
                  <i-input v-model="form.userID" placeholder="请输入手机号" @on-enter="handleSubmit">
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
                <form-item>
                  <i-button @click="handleSubmit" type="primary" long>登录</i-button>
                </form-item>
              </i-form>
              <p class="login-tip">手机号是自己账户的账号，不是自己名字</p>
            </div>
          </Card>
        </div>
      </i-col>
      <i-col span="2">&nbsp;</i-col>
    </Row>
  </div>
</template>

<script>
import { post } from '../../utils/http'
import Cookies from 'js-cookie'
import logo from '../../static/images/logo1.png'
export default {
  data () {
    return {
      note: {
        logo,
        backgroundImage: 'url(' + require('../../static/images/login.jpg') + ')',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center center',
        backgroundSize: 'cover',
        backgroundAttachment: 'fixed'
      },
      form: {
        userID: '',
        password: ''
      },
      retMsg: '',
      rules: {
        userID: [
          { required: true, message: "请输入手机号。", trigger: "blur" }
        ],
        password: [
          { required: true, message: "请输入密码。", trigger: "blur" }
        ]
      }
    }
  },
  created() {
    var code = this.$route.query.code;
    var state = this.$route.query.state;
    if (this.$store.getters._isMobile) {
      this.$router.replace("/mobile");
      // this.$router.push('/home')
      return;
    }else{
      this.$router.replace("/");
      // this.$router.push('/home')
      return;
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
      const params = {
        userID: this.form.userID,
        password: this.form.password
      }
      Cookies.set('uName',  this.form.userID)
      Cookies.set('token',  "GJSGDJSHGDjsgdajgJASGDHAGSdhasgjAghjDHAGHDGA")
      this.$router.push('/home')
      // post('/login', params)
      //   .then((response) => {
      //     if (response.retCode === 0) {
      //       Cookies.set('token', response.retData.access_token)
      //       Cookies.set('uCode', response.retData.userCode)
      //       Cookies.set('uName', response.retData.userName)
      //       Cookies.set('uLevel', response.retData.userLevel)
      //       Cookies.set('lcSeats', response.retData.lc_seats) //小灵呼坐席号
      //       this.$router.push('/home')
      //     } else if (response.retCode === 30003) {
      //       this.$Notice.error({
      //         title: '登陆失败',
      //         desc: response.retMsg
      //       });
      //     }
      //   }, err => {
      //
      //     this.$Notice.error({
      //       title: '服务器错误',
      //       desc: err
      //     });
      //   })
    }
  }
}
</script>

<style scoped>
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

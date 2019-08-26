<template>
  <div class="note full-screen" :style="note">
    <nav id="nav-menu" class="main-nav">
      <ul class="main-menu">
        <!--                    <img  style="float: left;width: 100px;height: 100%;" :src="logo" key="max-logo"/>-->
        <div class="titleName">供应商系统</div>
        <li class="main-menu-li">
          <a class="main-menu-li-a">{{uName}}</a>
          <ul>
            <li class="main-menu-li" @click="logout">
              <a class="main-menu-li-a main-menu-li-a-two">登出</a>
            </li>
          </ul>
        </li>
      </ul>
    </nav>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <Row>
      <ul id="app-changzhou">
        <i-col span="3">&nbsp;</i-col>
        <i-col span="3">
          <li>
            <router-link to="/home/base">
              <a class="app-a">
                <img src="../static/jichu.png"><br/>
                基础管理</a>
            </router-link>
          </li>
        </i-col>
        <i-col span="1">&nbsp;</i-col>
        <i-col span="3">
          <li>
            <router-link to="/home/order">
              <a class="app-a">
                <img src="../static/paiban.png"><br/>
                采购订单</a>
            </router-link>
          </li>
        </i-col>
        <i-col span="1">&nbsp;</i-col>
        <i-col span="3">
          <li>
            <router-link to="/home/production">
              <a class="app-a">
                <img src="../static/shenpi.png"><br/>
                生产管理</a>
            </router-link>
          </li>
        </i-col>
        <i-col span="1">&nbsp;</i-col>
        <i-col span="3">
          <li>
            <router-link to="/home/warehouse">
              <a class="app-a">
                <img src="../static/gongdan.png"><br/>
                仓库管理</a>
            </router-link>
          </li>
        </i-col>
        <i-col span="1">&nbsp;</i-col>
        <i-col span="3">
          <li>
            <router-link to="/home/delivery">
              <a class="app-a">
                <img src="../static/paiban.png"><br/>
                送货管理</a>
            </router-link>
          </li>
        </i-col>

        <i-col span="3">&nbsp;</i-col>
        <i-col span="3">
          <br><br><br>
          <li>
            <router-link to="/home">
              <a class="app-a">
                <img src="../static/tongji.png"><br/>
                统计管理</a>
            </router-link>
          </li>
        </i-col>
      </ul>
    </Row>
    <!--<div id="app-list" style="height: 700px">-->
    <!--</div>-->
  </div>
</template>

<script>
  import Cookies from 'js-cookie'
  import {post} from '../utils/http'
  import common from '../utils/common'
  import {baseURL} from '../IPconfig'
  import {constant} from '../constant/constant'
  import logo from '../static/images/bg.jpg'

  export default {
    name: 'home',
    data() {
      return {
        note: {
          backgroundImage: 'url(' + require('../static/images/bg.jpg') + ')',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center center',
          backgroundSize: 'cover',
          backgroundAttachment: 'fixed'
        },
        logo,
        accountID: '',
        uName: '',
        phone: '', //电话号码
        seats: '',
        seats_static: '',
        lc_seats: ''
      }
    },
    mounted() {
      if (common.isTokenUndefined(this) == false) {
        this.$router.push('/')
        return
      } else {
        if (this.$store.getters._isMobile) {
          this.$router.replace("/mobile");
        }
      }

    },
    methods: {
      //登出
      logout() {
        let timer = sessionStorage.getItem('timer')
        clearInterval(timer)
        constant.LCTimerStatus = false
        common.logout()
        this.$router.push('/')
      },
    }
  }
</script>

<style scoped src="../static/BootstrapBtn.css"></style>
<style scoped>
  .layout-logo-left {
    width: 50%;
    height: 70%;
    border-radius: 3px;
    float: left;
    padding-left: 10px;

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

  .main-nav {
    /*width: 4.1%;*/
    width: 100%;
    float: right;
    margin: 0;
    padding: 0;
    height: 55px;
    background-color: #122b40;
  }

  #nav-menu .main-menu {
    margin: 0;
    padding: 0;
    width: 100%;
    float: left;
    height: 100%;
  }

  #nav-menu .main-menu-li {
    width: 80px;
    height: 100%;
    overflow: hidden;
    float: right;
  }

  #nav-menu .main-menu-li-a {
    position: relative;
    display: block;
    height: 100%;
    text-align: center;
    padding-top: 17px;
    text-decoration: none;
    color: #FFF;
    cursor: default;
    font-size: 15px;
  }

  #nav-menu .main-menu-li-a-two {
    padding-bottom: 15px;
    cursor: pointer;
  }

  #nav-menu a:hover {
    background-color: #666666;
    color: #FFFFFF;
  }

  #nav-menu ul li ul li {
    background-color: #231f20;
    height: 30px;
  }

  #nav-menu ul li ul {
    position: absolute;
    top: 55px;
    right: 0px;
    display: none; /*默认状态下或鼠标离开时隐藏*/
    width: 80px;
  }

  #nav-menu ul li:hover ul {
    display: block;
  }


  #app-changzhou {
    /*float: left;*/
    text-align: center;
    /*margin: auto;*/
    list-style: none;
    font-size: 15px;
  }

  #app-changzhou .app-a {
    text-decoration: none;
    border: solid 1px transparent;
    display: block;
    /*padding: 3px;*/
    /*margin: 20px 0 0 0;*/
    color: #ffffff;
    text-shadow: 0.2em 0.1em 0.3em #000000;
  }

  #app-changzhou .app-a img {
    border-radius: 25px;
  }

  #app-changzhou .app-a:hover {
    border: solid 1px #bbd6ec;
    -webkit-border-radius: 3px;
    box-shadow: inset 0 0 1px #fff;
    -webkit-box-shadow: inset 0 0 1px #fff;
    background-color: #5caae8;
    border-radius: 10px;
  }

  #app-changzhou ul {
    display: inline-block;
  }

  #app-changzhou li {
    float: left;
    list-style: none;
    display: inline-block;
    /*margin-left: 20px;*/
    /*margin-right: 20px;*/
  }

  #app-list ul {
    position: absolute;
    width: 50%;
    left: 50%;
    top: 40%;
    transform: translate(-50%, -50%);
  }

  .titleName {
    color: #fff;
    font-size: 18px;
    float: left;
    width: 80%;
    line-height: 55px;
    text-align: left;
    font-weight: bold;
    margin-left: 10px
  }
</style>

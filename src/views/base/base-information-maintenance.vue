<template>
  <div>
    <row :gutter="16"  class="i-table-show" style="margin-left: 280px;">
      <i-col span="1"></i-col>
      <i-col span="3" class="label">公司编号：</i-col>
      <i-col span="4" >
        <label >{{company_sn}}</label>
      </i-col>
      <i-col span="2"></i-col>
      <i-col span="3" class="label">公司：</i-col>
      <i-col span="4"  style="text-align: left">
        <label>{{company_name}}</label>
      </i-col>
      <i-col span="8">
      </i-col>
    </row>
    <row :gutter="16" class="i-table-show" style="margin-left: 280px" >
      <i-col span="1"></i-col>
      <i-col span="3" class="label">联系人：</i-col>
      <i-col span="4" >
        <label >{{contacts}}</label>
      </i-col>
      <i-col span="2"></i-col>
      <i-col span="3" class="label">联系方式：</i-col>
      <i-col span="4"  style="text-align: left">
        <label>{{user_mobile}}</label>
      </i-col>
      <i-col span="8">
        <i-button type="primary" @click="clearPassword()">修改密码</i-button>
      </i-col>
    </row>
    <br>
    <Modal :title=title :mask-closable="false" v-model="restPassword" width=25 :loading="loading">
      <i-form :rules="checkRules" ref="rePassword" :model="staffPassword">
        <row :gutter="16" style="text-align: center">
          <i-col span="4">&nbsp;</i-col>
          <i-col span="16">
            <form-item label="原密码：">
              <i-input type="password" v-model="staffPassword.oldPassword"/>
            </form-item>
          </i-col>
          <i-col span="4">&nbsp;</i-col>
        </row>
        <row :gutter="16" style="margin-bottom: 20px;display:flex;font-size: 15px">
          <i-col span="4">&nbsp;</i-col>
          <i-col span="16">
            <form-item label="新密码：" prop="password">
              <i-input type="password" :maxlength="20" v-model="staffPassword.password" typeof="password"/>
            </form-item>
          </i-col>
          <i-col span="4">&nbsp;</i-col>
        </row>
        <row :gutter="16" style="margin-bottom: 20px;display:flex;font-size: 15px">
          <i-col span="4">&nbsp;</i-col>
          <i-col span="16">
            <form-item label="新密码确认：" prop="passwords">
              <i-input type="password" :maxlength="20" v-model="staffPassword.passwords"
                       @on-enter="updatePassword"/>
            </form-item>
          </i-col>
          <i-col span="4">&nbsp;</i-col>
        </row>
      </i-form>
      <div slot="footer">
        <i-button @click="restPassword = false">取消</i-button>
        <i-button type="primary" @click="updatePassword()" v-preventReClick>保存</i-button>
      </div>
    </Modal>
  </div>
</template>

<script>

  import {post} from '@/utils/http'
  import {constant} from '@/constant/constant'
  import Common from "@/utils/common";
  import VueUeditorWrap from 'vue-ueditor-wrap'
  import Cookies from 'js-cookie'
  export default {
    name: 'Ueditor',
    components: {VueUeditorWrap},
      data() {
      return {
        // <--------------------          基础变量          -------------------->
        title:'修改密码',
        loading:true,
        restPassword:false,
        company_sn:Cookies.get("company_sn"),
        company_name:Cookies.get("company_name"),
        contacts:Cookies.get("uName"),
        user_mobile:Cookies.get("user_mobile"),
        staffPassword:{
          staffPassword: {
            oldPassword: '',
            password: '',
            passwords: ''
          },
        },
        checkRules: {

        },
      }
    },
    mounted() {
      if (Common.isTokenUndefined(this) == false) {
        this.$router.push('/')
        return
      } else {
        // this.tableHeight = document.documentElement.clientHeight - 600
      }
    },
    methods: {
      //<--------------------          增删改查翻页          -------------------->
      //修改密码
      updatePassword(){
        if(Common.isNullOrUndefined(this.staffPassword.oldPassword)&&
         Common.isNullOrUndefined(this.staffPassword.password)&&
         Common.isNullOrUndefined(this.staffPassword.passwords)){
          if (this.staffPassword.password == this.staffPassword.passwords) {
            let params = {}
            params.user_id = Cookies.get("user_id")
            params.pwd = this.staffPassword.oldPassword
            params.repwd = this.staffPassword.password
            params.repwd2 = this.staffPassword.passwords
            post('/index/Index/modPwd', params).then((response) => {
              // console.log(JSON.stringify(response))
              if (response.code === constant.distributorOkCodePwd) {
                Common.infoNotice(this,  response.msg, '修改密码')
                this.restPassword = false
              } else {
                Common.errNotice(this, response.msg, constant.distributorErrTitle1)
              }
            }, err => {
              Common.errNotice(this, err, constant.distributorErrTitle)
            })
          } else {
            Common.errNotice(this,  '输入两次密码不相同，请确认密码！')
          }
        }
      },
      clearPassword(){
        this.staffPassword.oldPassword = ""
        this.staffPassword.password = ""
        this.staffPassword.passwords = ""
        this.restPassword = true
      }
    }
  }
</script>

<style>
  .label {
    text-align: left;
    margin: auto;
  }
  .label-style-information{
  ;font-weight: bold;font-size: 18px
  }
  .i-table-show  {
    font-weight: bold;
    font-size: 18px;
    padding-top: 180px;
    /*margin-top: 180px*/
  }
</style>

<template>
  <div>
    <row  style="margin-bottom: 29px;display:flex;font-size: 15px">&nbsp;</row>
    <row>
      <i-table border :height="tableHeight" :columns="framework" :data="mainRole"></i-table>
    </row>
    <row>
    </row>
    <Modal :title="AuthTitle" :mask-closable="false" v-model="isModeAuth" width="40" :loading="loading">
      <div>
        <Tree :data="baseData" show-checkbox ref="authorizationTree"></Tree>
      </div>
      <div slot="footer">
        <i-button @click="cancelSubmit()">取消</i-button>
        <i-button type="primary" @click="saveAuth">保存</i-button>
      </div>
    </Modal>
  </div>
</template>
<script>
  import {constant} from '../../constant/constant'
  import Common from "../../utils/common";
  import {post, setAxiosbaseURL} from '../../utils/http'
  import Cookies from 'js-cookie'
  export default {
    data() {
      return {
        AuthTitle:'',
        mainRole: [],
        tableHeight: '',
        role_value: '',
        loading: '',
        role_name: '',
        isModeAuth: false,
        baseData: [],
        framework: [
          {
            title: '编号',
            align: 'center',
            key: 'code',
          },
          {
            title: '名称',
            align: 'center',
            key: 'name',
          },
          {
            title: '操作',
            align: 'center',
            render: (h, params) => {
              return h('div', [
                h('Button', {
                  props: {
                    type: 'error',
                    size: 'small'
                  },
                  on: {
                    click: () => {
                      this.getAuth(params.row)
                    }
                  }
                }, '权限设置')
              ]);
            }
          },
          {
            title: '版本',
            key: 'version',
            align: 'left',
            width: 1,
            render: (h) => {
              h.hidden
            }
          }
        ],
      }
    },
    mounted() {

      this.tableHeight = document.documentElement.clientHeight - 249
      this.initialiseIndex()
    },
    methods: {
      initialiseIndex() {
        post('/roleCompetence/searchStaffLevel').then((response) => {
          if (response.retCode === constant.changzhouServerOkCode) {
            this.mainRole = response.retData
          } else {
            Common.errNotice(this, response.retMsg, constant.distributorErrTitle)
          }
        }, err => {
          Common.errNotice(this, err, constant.distributorErrTitle)
        })
      },
      getAuth(row) {
          this.AuthTitle = row.name +  "权限设置"

        post('/sysMenu/getRoleMenuTree?role_value=' + row.code).then((response) => {
          if (response.retCode === constant.changzhouServerOkCode) {
            // console.log(JSON.stringify(response))
            this.isModeAuth = true
            this.baseData = response.retData
            this.role_value = row.code
            this.role_name = row.name
          } else {
            Common.errNotice(this, response.retMsg, constant.distributorErrTitle)
          }
        }, err => {
          Common.errNotice(this, err, constant.distributorErrTitle)
        })
      },
      saveAuth() {
        let node = this.$refs.authorizationTree.getCheckedNodes();
        let menu_param = [];
        node.forEach(item => {
          menu_param.push({"role_value": this.role_value, "sys_menu_code": item.code});
        });
        if (menu_param.length === 0) {
          menu_param.push({"role_value": this.role_value, "sys_menu_code": null});
        }
        post('/roleCompetence/saveCompetence', menu_param).then((response) => {
          if (response.retCode === constant.changzhouServerOkCode) {
            Common.infoNotice(this, this.role_name + ' 角色授权成功。', '角色授权')
            this.isModeAuth = false
            this.initialiseIndex()
          } else {
            Common.errNotice(this, response.retMsg, constant.distributorErrTitle)
          }
        }, err => {
          Common.errNotice(this, err, constant.distributorErrTitle)
        })
      },
      cancelSubmit() {
        this.isModeAuth = false
      },
    }
  }
</script>

